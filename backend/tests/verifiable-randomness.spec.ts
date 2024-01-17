import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { VerifiableRandomnessClient } from '../smart_contracts/artifacts/verifiable_randomness/client'
import { MockRandomnessBeaconClient } from "../smart_contracts/artifacts/mock_randomness_beacon/client";
import {Account, Algodv2, algosToMicroalgos, Indexer} from 'algosdk'
import * as algokit from '@algorandfoundation/algokit-utils'
import {microAlgos} from "@algorandfoundation/algokit-utils";

describe('verifiable randomness contract', () => {
  const localnet = algorandFixture()
  beforeAll(() => {
    algokit.Config.configure({
      debug: true,
      // traceAll: true,
    })
  })
  beforeEach(localnet.beforeEach)

  const deploy = async (account: Account, algod: Algodv2, indexer: Indexer) => {
    const mockRBClient = new MockRandomnessBeaconClient(
      {
        resolveBy: 'creatorAndName',
        findExistingUsing: indexer,
        sender: account,
        creatorAddress: account.addr,
      },
      algod,
    )
    const mockRBDeployment = await mockRBClient.deploy({
      allowDelete: true,
      allowUpdate: true,
      onSchemaBreak: 'replace',
      onUpdate: 'update',
    })

    const VRClient = new VerifiableRandomnessClient(
      {
        resolveBy: 'creatorAndName',
        findExistingUsing: indexer,
        sender: account,
        creatorAddress: account.addr,
      },
      algod,
    )
    await VRClient.deploy({
      allowDelete: true,
      allowUpdate: true,
      onSchemaBreak: 'replace',
      onUpdate: 'update',
      deployTimeParams: {
        TMPL_RANDOMNESS_BEACON_APP_ID: mockRBDeployment.appId
      }
    })
    
    return { client: VRClient, mRBID: mockRBDeployment.appId }
  }

  test('says hello', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const { client } = await deploy(testAccount, algod, indexer)

    const result = await client.hello({ name: 'World' })

    expect(result.return).toBe('Hello, World')
  })

  test('simulate says hello with correct budget consumed', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const { client } = await deploy(testAccount, algod, indexer)
    const result = await client.compose().hello({ name: 'World' }).hello({ name: 'Jane' }).simulate()

    expect(result.methodResults[0].returnValue).toBe('Hello, World')
    expect(result.methodResults[1].returnValue).toBe('Hello, Jane')
    expect(result.simulateResponse.txnGroups[0].appBudgetConsumed).toBeLessThan(100)
  })

  test('commits and extracts randomness', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const { client, mRBID } = await deploy(testAccount, algod, indexer)

    const currentStatus = await algod.status().do()
    await client.commit({
      block_commitment: currentStatus['last-round'] + 2,
      length: 3
    })

    const result = await client.integers({
      block_commitment: currentStatus['last-round'] + 2,
      randomness_beacon: mRBID
    }, {
      sendParams: {
        fee: microAlgos(2_000)
      }
    })

    expect(result.return).toStrictEqual([9076553810879439n, 16676498766615284173n, 9276153543560570338n])
  })
})