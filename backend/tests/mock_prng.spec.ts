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
    [
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42]),
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 54]),
      [
        9705778491962043240n,
        1370407407632858425n,
        11774395822783136600n,
        17944889938176486912n,
        14437308781460811564n,
        6944869453235589526n,
      ],
    ],
  ])(
    'compare SC PRNG against known correct sequence',
    async (initstate, initseq, expected) => {
      const { algod, indexer, testAccount } = localnet.context
      const { client } = await deploy(testAccount, algod, indexer)

      const result = await client.integers(
        { initstate: initstate, initseq: initseq, length: 6 },
        { sendParams: { fee: microAlgos(31e3) } },
      )

      expect(result.return).toStrictEqual(expected)
    },
    10e6,
  )

  test.each([
    [
      new Uint8Array(16),
      new Uint8Array(16)
    ],
    // This seed used to be a pathological case for our PRNG because, after 41 number generations,
    //  the internal state becomes a 15 bytes number (instead of 16).
    // This is because any bytes math operation in the AVM will strip all 0 bytes to the left of the MSB.
    // As a result, some operations that assume that the length is 16 were crashing.
    // This seed must always be a test case to make sure that we don't regress.
    [
      new Uint8Array([0, 32, 63, 19, 221, 174, 163, 207, 50, 27, 4, 143, 203, 157, 138, 254]),
      new Uint8Array([150, 127, 131, 196, 81, 43, 252, 190, 172, 46, 0, 158, 185, 75, 130, 119])
    ],
  ])('can generate a long sequence', async (initstate, initseq) => {
    const { algod, indexer, testAccount } = localnet.context
    const { client } = await deploy(testAccount, algod, indexer)

    // Max log size = 1024 B which means that, if 4 B are used for the return selector and 2 B for the array length,
    //  we have floor((1024 - 6) / 8) = 127.
    const wantedSequenceLength = 127

    const result = await client.integers(
      { initstate, initseq, length: wantedSequenceLength },
      { sendParams: { fee: microAlgos(31e3) } },
    )

    expect(result.return!.length).toBe(wantedSequenceLength)
  })
})
