import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { MockPrngClient } from '../smart_contracts/artifacts/mock_prng/client'
import { Account, Algodv2, Indexer } from 'algosdk'
import * as algokit from '@algorandfoundation/algokit-utils'
import { microAlgos } from '@algorandfoundation/algokit-utils'

describe('mock prng contract', () => {
  const localnet = algorandFixture()
  beforeAll(() => {
    algokit.Config.configure({
      debug: true,
      // traceAll: true,
    })
  })
  beforeEach(localnet.beforeEach)

  const deploy = async (account: Account, algod: Algodv2, indexer: Indexer) => {
    const client = new MockPrngClient(
      {
        resolveBy: 'creatorAndName',
        findExistingUsing: indexer,
        sender: account,
        creatorAddress: account.addr,
      },
      algod,
    )
    await client.deploy({
      onSchemaBreak: 'append',
      onUpdate: 'append',
    })
    return { client }
  }

  // These test cases were generated using:
  // https://github.com/imneme/pcg-c/blob/master/sample/pcg64-demo.c
  test.each([
    [
      new Uint8Array(16),
      new Uint8Array(16),
      [
        15347903478529588745n,
        16742835166660011750n,
        4205113247249107985n,
        8864284187113353750n,
        2051478307229679210n,
        2597313632178997542n,
      ],
    ],
  ])(
    'compare SC PRNG against known correct sequence',
    async (initstate, initseq, expected) => {
      const { algod, indexer, testAccount } = localnet.context
      const { client } = await deploy(testAccount, algod, indexer)

      const result = await client.integers(
        { initstate: initstate, initseq: initseq, length: 6 },
        { sendParams: { fee: microAlgos(101e3) } },
      )

      expect(result.return).toStrictEqual(expected)
    },
    10e6,
  )
})
