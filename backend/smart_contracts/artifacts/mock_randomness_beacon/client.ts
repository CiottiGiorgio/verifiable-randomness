/* eslint-disable */
/**
 * This file was automatically generated by @algorandfoundation/algokit-client-generator.
 * DO NOT MODIFY IT BY HAND.
 * requires: @algorandfoundation/algokit-utils: ^2
 */
import * as algokit from '@algorandfoundation/algokit-utils'
import type {
  AppCallTransactionResult,
  AppCallTransactionResultOfType,
  CoreAppCallArgs,
  RawAppCallArgs,
  AppState,
  TealTemplateParams,
  ABIAppCallArg,
} from '@algorandfoundation/algokit-utils/types/app'
import type {
  AppClientCallCoreParams,
  AppClientCompilationParams,
  AppClientDeployCoreParams,
  AppDetails,
  ApplicationClient,
} from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type {
  SendTransactionResult,
  TransactionToSign,
  SendTransactionFrom,
} from '@algorandfoundation/algokit-utils/types/transaction'
import type { ABIResult, TransactionWithSigner, modelsv2 } from 'algosdk'
import { Algodv2, OnApplicationComplete, Transaction, AtomicTransactionComposer } from 'algosdk'
export const APP_SPEC: AppSpec = {
  hints: {
    'must_get(uint64,byte[])byte[]': {
      call_config: {
        no_op: 'CALL',
      },
    },
  },
  source: {
    approval:
      'I3ByYWdtYSB2ZXJzaW9uIDgKaW50Y2Jsb2NrIDAgMQpieXRlY2Jsb2NrIDB4CnR4biBOdW1BcHBBcmdzCmludGNfMCAvLyAwCj09CmJueiBtYWluX2w0CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4NDdjMjBjMjMgLy8gIm11c3RfZ2V0KHVpbnQ2NCxieXRlW10pYnl0ZVtdIgo9PQpibnogbWFpbl9sMwplcnIKbWFpbl9sMzoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKY2FsbHN1YiBtdXN0Z2V0Y2FzdGVyXzMKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDQ6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KYm56IG1haW5fbDEwCnR4biBPbkNvbXBsZXRpb24KcHVzaGludCA0IC8vIFVwZGF0ZUFwcGxpY2F0aW9uCj09CmJueiBtYWluX2w5CnR4biBPbkNvbXBsZXRpb24KcHVzaGludCA1IC8vIERlbGV0ZUFwcGxpY2F0aW9uCj09CmJueiBtYWluX2w4CmVycgptYWluX2w4Ogp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQphc3NlcnQKY2FsbHN1YiBkZWxldGVfMQppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sOToKdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KYXNzZXJ0CmNhbGxzdWIgdXBkYXRlXzAKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDEwOgp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAo9PQphc3NlcnQKaW50Y18xIC8vIDEKcmV0dXJuCgovLyB1cGRhdGUKdXBkYXRlXzA6CnByb3RvIDAgMAp0eG4gU2VuZGVyCmdsb2JhbCBDcmVhdG9yQWRkcmVzcwo9PQovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0CnB1c2hpbnQgVE1QTF9VUERBVEFCTEUgLy8gVE1QTF9VUERBVEFCTEUKLy8gQ2hlY2sgYXBwIGlzIHVwZGF0YWJsZQphc3NlcnQKcmV0c3ViCgovLyBkZWxldGUKZGVsZXRlXzE6CnByb3RvIDAgMAp0eG4gU2VuZGVyCmdsb2JhbCBDcmVhdG9yQWRkcmVzcwo9PQovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0CnB1c2hpbnQgVE1QTF9ERUxFVEFCTEUgLy8gVE1QTF9ERUxFVEFCTEUKLy8gQ2hlY2sgYXBwIGlzIGRlbGV0YWJsZQphc3NlcnQKcmV0c3ViCgovLyBtdXN0X2dldAptdXN0Z2V0XzI6CnByb3RvIDIgMQpieXRlY18wIC8vICIiCnB1c2hieXRlcyBUTVBMX01PQ0tfVlJGX09VVFBVVCAvLyBUTVBMX01PQ0tfVlJGX09VVFBVVApmcmFtZV9idXJ5IDAKZnJhbWVfZGlnIDAKbGVuCml0b2IKZXh0cmFjdCA2IDAKZnJhbWVfZGlnIDAKY29uY2F0CmZyYW1lX2J1cnkgMApyZXRzdWIKCi8vIG11c3RfZ2V0X2Nhc3RlcgptdXN0Z2V0Y2FzdGVyXzM6CnByb3RvIDAgMApieXRlY18wIC8vICIiCmludGNfMCAvLyAwCmJ5dGVjXzAgLy8gIiIKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQpidG9pCmZyYW1lX2J1cnkgMQp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCmZyYW1lX2J1cnkgMgpmcmFtZV9kaWcgMQpmcmFtZV9kaWcgMgpjYWxsc3ViIG11c3RnZXRfMgpmcmFtZV9idXJ5IDAKcHVzaGJ5dGVzIDB4MTUxZjdjNzUgLy8gMHgxNTFmN2M3NQpmcmFtZV9kaWcgMApjb25jYXQKbG9nCnJldHN1Yg==',
    clear: 'I3ByYWdtYSB2ZXJzaW9uIDgKcHVzaGludCAwIC8vIDAKcmV0dXJu',
  },
  state: {
    global: {
      num_byte_slices: 0,
      num_uints: 0,
    },
    local: {
      num_byte_slices: 0,
      num_uints: 0,
    },
  },
  schema: {
    global: {
      declared: {},
      reserved: {},
    },
    local: {
      declared: {},
      reserved: {},
    },
  },
  contract: {
    name: 'mock_randomness_beacon',
    methods: [
      {
        name: 'must_get',
        args: [
          {
            type: 'uint64',
            name: 'block',
          },
          {
            type: 'byte[]',
            name: 'user_data',
          },
        ],
        returns: {
          type: 'byte[]',
        },
      },
    ],
    networks: {},
  },
  bare_call_config: {
    delete_application: 'CALL',
    no_op: 'CREATE',
    update_application: 'CALL',
  },
}

/**
 * Defines an onCompletionAction of 'no_op'
 */
export type OnCompleteNoOp = { onCompleteAction?: 'no_op' | OnApplicationComplete.NoOpOC }
/**
 * Defines an onCompletionAction of 'opt_in'
 */
export type OnCompleteOptIn = { onCompleteAction: 'opt_in' | OnApplicationComplete.OptInOC }
/**
 * Defines an onCompletionAction of 'close_out'
 */
export type OnCompleteCloseOut = { onCompleteAction: 'close_out' | OnApplicationComplete.CloseOutOC }
/**
 * Defines an onCompletionAction of 'delete_application'
 */
export type OnCompleteDelApp = { onCompleteAction: 'delete_application' | OnApplicationComplete.DeleteApplicationOC }
/**
 * Defines an onCompletionAction of 'update_application'
 */
export type OnCompleteUpdApp = { onCompleteAction: 'update_application' | OnApplicationComplete.UpdateApplicationOC }
/**
 * A state record containing a single unsigned integer
 */
export type IntegerState = {
  /**
   * Gets the state value as a BigInt
   */
  asBigInt(): bigint
  /**
   * Gets the state value as a number.
   */
  asNumber(): number
}
/**
 * A state record containing binary data
 */
export type BinaryState = {
  /**
   * Gets the state value as a Uint8Array
   */
  asByteArray(): Uint8Array
  /**
   * Gets the state value as a string
   */
  asString(): string
}

/**
 * Defines the types of available calls and state of the MockRandomnessBeacon smart contract.
 */
export type MockRandomnessBeacon = {
  /**
   * Maps method signatures / names to their argument and return types.
   */
  methods: Record<
    'must_get(uint64,byte[])byte[]' | 'must_get',
    {
      argsObj: {
        block: bigint | number
        user_data: Uint8Array
      }
      argsTuple: [block: bigint | number, user_data: Uint8Array]
      returns: Uint8Array
    }
  >
}
/**
 * Defines the possible abi call signatures
 */
export type MockRandomnessBeaconSig = keyof MockRandomnessBeacon['methods']
/**
 * Defines an object containing all relevant parameters for a single call to the contract. Where TSignature is undefined, a bare call is made
 */
export type TypedCallParams<TSignature extends MockRandomnessBeaconSig | undefined> = {
  method: TSignature
  methodArgs: TSignature extends undefined ? undefined : Array<ABIAppCallArg | undefined>
} & AppClientCallCoreParams &
  CoreAppCallArgs
/**
 * Defines the arguments required for a bare call
 */
export type BareCallArgs = Omit<RawAppCallArgs, keyof CoreAppCallArgs>
/**
 * Maps a method signature from the MockRandomnessBeacon smart contract to the method's arguments in either tuple of struct form
 */
export type MethodArgs<TSignature extends MockRandomnessBeaconSig> = MockRandomnessBeacon['methods'][TSignature][
  | 'argsObj'
  | 'argsTuple']
/**
 * Maps a method signature from the MockRandomnessBeacon smart contract to the method's return type
 */
export type MethodReturn<TSignature extends MockRandomnessBeaconSig> =
  MockRandomnessBeacon['methods'][TSignature]['returns']

/**
 * A factory for available 'create' calls
 */
export type MockRandomnessBeaconCreateCalls = (typeof MockRandomnessBeaconCallFactory)['create']
/**
 * Defines supported create methods for this smart contract
 */
export type MockRandomnessBeaconCreateCallParams = TypedCallParams<undefined> & OnCompleteNoOp
/**
 * A factory for available 'update' calls
 */
export type MockRandomnessBeaconUpdateCalls = (typeof MockRandomnessBeaconCallFactory)['update']
/**
 * Defines supported update methods for this smart contract
 */
export type MockRandomnessBeaconUpdateCallParams = TypedCallParams<undefined>
/**
 * A factory for available 'delete' calls
 */
export type MockRandomnessBeaconDeleteCalls = (typeof MockRandomnessBeaconCallFactory)['delete']
/**
 * Defines supported delete methods for this smart contract
 */
export type MockRandomnessBeaconDeleteCallParams = TypedCallParams<undefined>
/**
 * Defines arguments required for the deploy method.
 */
export type MockRandomnessBeaconDeployArgs = {
  deployTimeParams?: TealTemplateParams
  /**
   * A delegate which takes a create call factory and returns the create call params for this smart contract
   */
  createCall?: (callFactory: MockRandomnessBeaconCreateCalls) => MockRandomnessBeaconCreateCallParams
  /**
   * A delegate which takes a update call factory and returns the update call params for this smart contract
   */
  updateCall?: (callFactory: MockRandomnessBeaconUpdateCalls) => MockRandomnessBeaconUpdateCallParams
  /**
   * A delegate which takes a delete call factory and returns the delete call params for this smart contract
   */
  deleteCall?: (callFactory: MockRandomnessBeaconDeleteCalls) => MockRandomnessBeaconDeleteCallParams
}

/**
 * Exposes methods for constructing all available smart contract calls
 */
export abstract class MockRandomnessBeaconCallFactory {
  /**
   * Gets available create call factories
   */
  static get create() {
    return {
      /**
       * Constructs a create call for the mock_randomness_beacon smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(
        params: BareCallArgs &
          AppClientCallCoreParams &
          CoreAppCallArgs &
          AppClientCompilationParams &
          OnCompleteNoOp = {},
      ) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Gets available update call factories
   */
  static get update() {
    return {
      /**
       * Constructs an update call for the mock_randomness_beacon smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams = {}) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Gets available delete call factories
   */
  static get delete() {
    return {
      /**
       * Constructs a delete call for the mock_randomness_beacon smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Constructs a no op call for the must_get(uint64,byte[])byte[] ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static mustGet(args: MethodArgs<'must_get(uint64,byte[])byte[]'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'must_get(uint64,byte[])byte[]' as const,
      methodArgs: Array.isArray(args) ? args : [args.block, args.user_data],
      ...params,
    }
  }
}

/**
 * A client to make calls to the mock_randomness_beacon smart contract
 */
export class MockRandomnessBeaconClient {
  /**
   * The underlying `ApplicationClient` for when you want to have more flexibility
   */
  public readonly appClient: ApplicationClient

  private readonly sender: SendTransactionFrom | undefined

  /**
   * Creates a new instance of `MockRandomnessBeaconClient`
   *
   * @param appDetails appDetails The details to identify the app to deploy
   * @param algod An algod client instance
   */
  constructor(appDetails: AppDetails, private algod: Algodv2) {
    this.sender = appDetails.sender
    this.appClient = algokit.getAppClient(
      {
        ...appDetails,
        app: APP_SPEC,
      },
      algod,
    )
  }

  /**
   * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
   *
   * @param result The AppCallTransactionResult to be mapped
   * @param returnValueFormatter An optional delegate to format the return value if required
   * @returns The smart contract response with an updated return value
   */
  protected mapReturnValue<TReturn>(
    result: AppCallTransactionResult,
    returnValueFormatter?: (value: any) => TReturn,
  ): AppCallTransactionResultOfType<TReturn> {
    if (result.return?.decodeError) {
      throw result.return.decodeError
    }
    const returnValue =
      result.return?.returnValue !== undefined && returnValueFormatter !== undefined
        ? returnValueFormatter(result.return.returnValue)
        : (result.return?.returnValue as TReturn | undefined)
    return { ...result, return: returnValue }
  }

  /**
   * Calls the ABI method with the matching signature using an onCompletion code of NO_OP
   *
   * @param typedCallParams An object containing the method signature, args, and any other relevant parameters
   * @param returnValueFormatter An optional delegate which when provided will be used to map non-undefined return values to the target type
   * @returns The result of the smart contract call
   */
  public async call<TSignature extends keyof MockRandomnessBeacon['methods']>(
    typedCallParams: TypedCallParams<TSignature>,
    returnValueFormatter?: (value: any) => MethodReturn<TSignature>,
  ) {
    return this.mapReturnValue<MethodReturn<TSignature>>(
      await this.appClient.call(typedCallParams),
      returnValueFormatter,
    )
  }

  /**
   * Idempotently deploys the mock_randomness_beacon smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  public deploy(
    params: MockRandomnessBeaconDeployArgs & AppClientDeployCoreParams = {},
  ): ReturnType<ApplicationClient['deploy']> {
    const createArgs = params.createCall?.(MockRandomnessBeaconCallFactory.create)
    const updateArgs = params.updateCall?.(MockRandomnessBeaconCallFactory.update)
    const deleteArgs = params.deleteCall?.(MockRandomnessBeaconCallFactory.delete)
    return this.appClient.deploy({
      ...params,
      updateArgs,
      deleteArgs,
      createArgs,
      createOnCompleteAction: createArgs?.onCompleteAction,
    })
  }

  /**
   * Gets available create methods
   */
  public get create() {
    const $this = this
    return {
      /**
       * Creates a new instance of the mock_randomness_beacon smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The create result
       */
      bare(
        args: BareCallArgs &
          AppClientCallCoreParams &
          AppClientCompilationParams &
          CoreAppCallArgs &
          OnCompleteNoOp = {},
      ): Promise<AppCallTransactionResultOfType<undefined>> {
        return $this.appClient.create(args) as unknown as Promise<AppCallTransactionResultOfType<undefined>>
      },
    }
  }

  /**
   * Gets available update methods
   */
  public get update() {
    const $this = this
    return {
      /**
       * Updates an existing instance of the mock_randomness_beacon smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The update result
       */
      bare(
        args: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs = {},
      ): Promise<AppCallTransactionResultOfType<undefined>> {
        return $this.appClient.update(args) as unknown as Promise<AppCallTransactionResultOfType<undefined>>
      },
    }
  }

  /**
   * Gets available delete methods
   */
  public get delete() {
    const $this = this
    return {
      /**
       * Deletes an existing instance of the mock_randomness_beacon smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The delete result
       */
      bare(
        args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {},
      ): Promise<AppCallTransactionResultOfType<undefined>> {
        return $this.appClient.delete(args) as unknown as Promise<AppCallTransactionResultOfType<undefined>>
      },
    }
  }

  /**
   * Makes a clear_state call to an existing instance of the mock_randomness_beacon smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The clear_state result
   */
  public clearState(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.appClient.clearState(args)
  }

  /**
   * Calls the must_get(uint64,byte[])byte[] ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public mustGet(
    args: MethodArgs<'must_get(uint64,byte[])byte[]'>,
    params: AppClientCallCoreParams & CoreAppCallArgs = {},
  ) {
    return this.call(MockRandomnessBeaconCallFactory.mustGet(args, params))
  }

  public compose(): MockRandomnessBeaconComposer {
    const client = this
    const atc = new AtomicTransactionComposer()
    let promiseChain: Promise<unknown> = Promise.resolve()
    const resultMappers: Array<undefined | ((x: any) => any)> = []
    return {
      mustGet(args: MethodArgs<'must_get(uint64,byte[])byte[]'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() =>
          client.mustGet(args, { ...params, sendParams: { ...params?.sendParams, skipSending: true, atc } }),
        )
        resultMappers.push(undefined)
        return this
      },
      get update() {
        const $this = this
        return {
          bare(args?: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs) {
            promiseChain = promiseChain.then(() =>
              client.update.bare({ ...args, sendParams: { ...args?.sendParams, skipSending: true, atc } }),
            )
            resultMappers.push(undefined)
            return $this
          },
        }
      },
      get delete() {
        const $this = this
        return {
          bare(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs) {
            promiseChain = promiseChain.then(() =>
              client.delete.bare({ ...args, sendParams: { ...args?.sendParams, skipSending: true, atc } }),
            )
            resultMappers.push(undefined)
            return $this
          },
        }
      },
      clearState(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() =>
          client.clearState({ ...args, sendParams: { ...args?.sendParams, skipSending: true, atc } }),
        )
        resultMappers.push(undefined)
        return this
      },
      addTransaction(
        txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>,
        defaultSender?: SendTransactionFrom,
      ) {
        promiseChain = promiseChain.then(async () =>
          atc.addTransaction(await algokit.getTransactionWithSigner(txn, defaultSender ?? client.sender)),
        )
        return this
      },
      async atc() {
        await promiseChain
        return atc
      },
      async simulate() {
        await promiseChain
        const result = await atc.simulate(client.algod)
        return result
      },
      async execute() {
        await promiseChain
        const result = await algokit.sendAtomicTransactionComposer({ atc, sendParams: {} }, client.algod)
        return {
          ...result,
          returns: result.returns?.map((val, i) =>
            resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue,
          ),
        }
      },
    } as unknown as MockRandomnessBeaconComposer
  }
}
export type MockRandomnessBeaconComposer<TReturns extends [...any[]] = []> = {
  /**
   * Calls the must_get(uint64,byte[])byte[] ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  mustGet(
    args: MethodArgs<'must_get(uint64,byte[])byte[]'>,
    params?: AppClientCallCoreParams & CoreAppCallArgs,
  ): MockRandomnessBeaconComposer<[...TReturns, MethodReturn<'must_get(uint64,byte[])byte[]'>]>

  /**
   * Gets available update methods
   */
  readonly update: {
    /**
     * Updates an existing instance of the mock_randomness_beacon smart contract using a bare call.
     *
     * @param args The arguments for the bare call
     * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
     */
    bare(
      args?: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs,
    ): MockRandomnessBeaconComposer<[...TReturns, undefined]>
  }

  /**
   * Gets available delete methods
   */
  readonly delete: {
    /**
     * Deletes an existing instance of the mock_randomness_beacon smart contract using a bare call.
     *
     * @param args The arguments for the bare call
     * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
     */
    bare(
      args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs,
    ): MockRandomnessBeaconComposer<[...TReturns, undefined]>
  }

  /**
   * Makes a clear_state call to an existing instance of the mock_randomness_beacon smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  clearState(
    args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs,
  ): MockRandomnessBeaconComposer<[...TReturns, undefined]>

  /**
   * Adds a transaction to the composer
   *
   * @param txn One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by one of algokit utils helpers (signer is obtained from the defaultSender parameter)
   * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not include a signer.
   */
  addTransaction(
    txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>,
    defaultSender?: SendTransactionFrom,
  ): MockRandomnessBeaconComposer<TReturns>
  /**
   * Returns the underlying AtomicTransactionComposer instance
   */
  atc(): Promise<AtomicTransactionComposer>
  /**
   * Simulates the transaction group and returns the result
   */
  simulate(): Promise<MockRandomnessBeaconComposerSimulateResult>
  /**
   * Executes the transaction group and returns the results
   */
  execute(): Promise<MockRandomnessBeaconComposerResults<TReturns>>
}
export type MockRandomnessBeaconComposerSimulateResult = {
  methodResults: ABIResult[]
  simulateResponse: modelsv2.SimulateResponse
}
export type MockRandomnessBeaconComposerResults<TReturns extends [...any[]]> = {
  returns: TReturns
  groupId: string
  txIds: string[]
  transactions: Transaction[]
}
