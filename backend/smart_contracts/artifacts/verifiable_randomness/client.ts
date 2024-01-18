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
import type { SendTransactionResult, TransactionToSign, SendTransactionFrom } from '@algorandfoundation/algokit-utils/types/transaction'
import type { ABIResult, TransactionWithSigner, modelsv2 } from 'algosdk'
import { Algodv2, OnApplicationComplete, Transaction, AtomicTransactionComposer } from 'algosdk'
export const APP_SPEC: AppSpec = {
  "hints": {
    "commit(uint64,uint16)void": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "integers(uint64,application)uint64[]": {
      "call_config": {
        "no_op": "CALL"
      }
    }
  },
  "source": {
    "approval": "I3ByYWdtYSB2ZXJzaW9uIDgKaW50Y2Jsb2NrIDAgMQpieXRlY2Jsb2NrIDB4IDB4NzI2MTZlNjQ2ZjZkNmU2NTczNzM1ZjYyNjU2MTYzNmY2ZSAweDAwMDAwMDAwMDAwMDAwMDAgMHgwMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIDB4MDAwMDAwMDAwMDAwMDAwMQp0eG4gTnVtQXBwQXJncwppbnRjXzAgLy8gMAo9PQpibnogbWFpbl9sNgp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweGQ3MTA1OGE1IC8vICJjb21taXQodWludDY0LHVpbnQxNil2b2lkIgo9PQpibnogbWFpbl9sNQp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweGU0MjQ3MDBlIC8vICJpbnRlZ2Vycyh1aW50NjQsYXBwbGljYXRpb24pdWludDY0W10iCj09CmJueiBtYWluX2w0CmVycgptYWluX2w0Ogp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydApjYWxsc3ViIGludGVnZXJzY2FzdGVyXzEzCmludGNfMSAvLyAxCnJldHVybgptYWluX2w1Ogp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydApjYWxsc3ViIGNvbW1pdGNhc3Rlcl8xMgppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sNjoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQpibnogbWFpbl9sMTIKdHhuIE9uQ29tcGxldGlvbgpwdXNoaW50IDQgLy8gVXBkYXRlQXBwbGljYXRpb24KPT0KYm56IG1haW5fbDExCnR4biBPbkNvbXBsZXRpb24KcHVzaGludCA1IC8vIERlbGV0ZUFwcGxpY2F0aW9uCj09CmJueiBtYWluX2wxMAplcnIKbWFpbl9sMTA6CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CmFzc2VydApjYWxsc3ViIGRlbGV0ZV8zCmludGNfMSAvLyAxCnJldHVybgptYWluX2wxMToKdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KYXNzZXJ0CmNhbGxzdWIgdXBkYXRlXzIKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDEyOgp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAo9PQphc3NlcnQKY2FsbHN1YiBjcmVhdGVfMQppbnRjXzEgLy8gMQpyZXR1cm4KCi8vIHByZWZpeF9rZXlfZ2VuCnByZWZpeGtleWdlbl8wOgpwcm90byAxIDEKcHVzaGJ5dGVzIDB4NjM2ZjZkNmQ2OTc0NmQ2NTZlNzQ3MyAvLyAiY29tbWl0bWVudHMiCmZyYW1lX2RpZyAtMQpjb25jYXQKcmV0c3ViCgovLyBjcmVhdGUKY3JlYXRlXzE6CnByb3RvIDAgMAppbnRjXzAgLy8gMApieXRlY18xIC8vICJyYW5kb21uZXNzX2JlYWNvbiIKYXBwX2dsb2JhbF9nZXRfZXgKc3RvcmUgMwpzdG9yZSAyCmxvYWQgMwohCmFzc2VydApieXRlY18xIC8vICJyYW5kb21uZXNzX2JlYWNvbiIKcHVzaGludCBUTVBMX1JBTkRPTU5FU1NfQkVBQ09OX0FQUF9JRCAvLyBUTVBMX1JBTkRPTU5FU1NfQkVBQ09OX0FQUF9JRAphcHBfZ2xvYmFsX3B1dApyZXRzdWIKCi8vIHVwZGF0ZQp1cGRhdGVfMjoKcHJvdG8gMCAwCnR4biBTZW5kZXIKZ2xvYmFsIENyZWF0b3JBZGRyZXNzCj09Ci8vIHVuYXV0aG9yaXplZAphc3NlcnQKcHVzaGludCBUTVBMX1VQREFUQUJMRSAvLyBUTVBMX1VQREFUQUJMRQovLyBDaGVjayBhcHAgaXMgdXBkYXRhYmxlCmFzc2VydApyZXRzdWIKCi8vIGRlbGV0ZQpkZWxldGVfMzoKcHJvdG8gMCAwCnR4biBTZW5kZXIKZ2xvYmFsIENyZWF0b3JBZGRyZXNzCj09Ci8vIHVuYXV0aG9yaXplZAphc3NlcnQKcHVzaGludCBUTVBMX0RFTEVUQUJMRSAvLyBUTVBMX0RFTEVUQUJMRQovLyBDaGVjayBhcHAgaXMgZGVsZXRhYmxlCmFzc2VydApyZXRzdWIKCi8vIGNvbW1pdApjb21taXRfNDoKcHJvdG8gMiAwCmZyYW1lX2RpZyAtMgpnbG9iYWwgUm91bmQKPgphc3NlcnQKZnJhbWVfZGlnIC0yCml0b2IKY2FsbHN1YiBwcmVmaXhrZXlnZW5fMApmcmFtZV9kaWcgLTEKaXRvYgpleHRyYWN0IDYgMAphcHBfZ2xvYmFsX3B1dApyZXRzdWIKCi8vIGludGVnZXJzCmludGVnZXJzXzU6CnByb3RvIDIgMQpieXRlY18wIC8vICIiCmludGNfMCAvLyAwCmJ5dGVjXzAgLy8gIiIKZnJhbWVfZGlnIC0yCmdsb2JhbCBSb3VuZAo8PQphc3NlcnQKZnJhbWVfZGlnIC0yCml0b2IKY2FsbHN1YiBwcmVmaXhrZXlnZW5fMAphcHBfZ2xvYmFsX2dldAppbnRjXzAgLy8gMApleHRyYWN0X3VpbnQxNgpmcmFtZV9idXJ5IDEKYnl0ZWNfMCAvLyAiIgpmcmFtZV9idXJ5IDIKZnJhbWVfZGlnIDIKbGVuCml0b2IKZXh0cmFjdCA2IDAKZnJhbWVfZGlnIDIKY29uY2F0CmZyYW1lX2J1cnkgMgppdHhuX2JlZ2luCnB1c2hpbnQgNiAvLyBhcHBsCml0eG5fZmllbGQgVHlwZUVudW0KYnl0ZWNfMSAvLyAicmFuZG9tbmVzc19iZWFjb24iCmFwcF9nbG9iYWxfZ2V0Cml0eG5fZmllbGQgQXBwbGljYXRpb25JRApwdXNoYnl0ZXMgMHgxODkzOTJjNSAvLyAiZ2V0KHVpbnQ2NCxieXRlW10pYnl0ZVtdIgppdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwpmcmFtZV9kaWcgLTIKaXRvYgppdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwpmcmFtZV9kaWcgMgppdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwppdHhuX3N1Ym1pdApieXRlY18yIC8vIDB4MDAwMDAwMDAwMDAwMDAwMApieXRlY18yIC8vIDB4MDAwMDAwMDAwMDAwMDAwMApjYWxsc3ViIHBybmdpbml0XzcKaW50Y18wIC8vIDAKc3RvcmUgNApieXRlY18wIC8vICIiCnN0b3JlIDUKaW50ZWdlcnNfNV9sMToKbG9hZCA0CmZyYW1lX2RpZyAxCjwKYnogaW50ZWdlcnNfNV9sMwpsb2FkIDUKY2FsbHN1YiBwcm5ncmFuZGludF8xMQppdG9iCmNvbmNhdApzdG9yZSA1CmxvYWQgNAppbnRjXzEgLy8gMQorCnN0b3JlIDQKYiBpbnRlZ2Vyc181X2wxCmludGVnZXJzXzVfbDM6CmZyYW1lX2RpZyAxCml0b2IKZXh0cmFjdCA2IDAKbG9hZCA1CmNvbmNhdApmcmFtZV9idXJ5IDAKcmV0c3ViCgovLyBwcm5nX3NldHNlcV9zdGVwCnBybmdzZXRzZXFzdGVwXzY6CnByb3RvIDAgMApsb2FkIDAKcHVzaGJ5dGVzIDB4MjM2MGVkMDUxZmM2NWRhNDQzODVkZjY0OWZjY2Y2NDUgLy8gMHgyMzYwZWQwNTFmYzY1ZGE0NDM4NWRmNjQ5ZmNjZjY0NQpiKgpsb2FkIDEKYisKYnl0ZWNfMyAvLyAweDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAKYiUKc3RvcmUgMApyZXRzdWIKCi8vIHBybmdfaW5pdApwcm5naW5pdF83Ogpwcm90byAyIDAKYnl0ZWNfMiAvLyAweDAwMDAwMDAwMDAwMDAwMDAKc3RvcmUgMApmcmFtZV9kaWcgLTEKcHVzaGJ5dGVzIDB4MDAwMDAwMDAwMDAwMDAwMiAvLyAweDAwMDAwMDAwMDAwMDAwMDIKYioKYnl0ZWMgNCAvLyAweDAwMDAwMDAwMDAwMDAwMDEKYisKYnl0ZWNfMyAvLyAweDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAKYiUKc3RvcmUgMQpjYWxsc3ViIHBybmdzZXRzZXFzdGVwXzYKbG9hZCAwCmZyYW1lX2RpZyAtMgpiKwpieXRlY18zIC8vIDB4MDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMApiJQpzdG9yZSAwCmNhbGxzdWIgcHJuZ3NldHNlcXN0ZXBfNgpyZXRzdWIKCi8vIHR3b3NfY29tcGxlbWVudAp0d29zY29tcGxlbWVudF84Ogpwcm90byAxIDEKZnJhbWVfZGlnIC0xCml0b2IKYn4KYnl0ZWMgNCAvLyAweDAwMDAwMDAwMDAwMDAwMDEKYisKc3RvcmUgNgpsb2FkIDYKbGVuCnB1c2hpbnQgOCAvLyA4Cj09CmJueiB0d29zY29tcGxlbWVudF84X2wyCmxvYWQgNgppbnRjXzEgLy8gMQpleHRyYWN0X3VpbnQ2NApyZXRzdWIKdHdvc2NvbXBsZW1lbnRfOF9sMjoKbG9hZCA2CmJ0b2kKcmV0c3ViCgovLyBfX3Bybmdfcm90YXRpb25fNjQKcHJuZ3JvdGF0aW9uNjRfOToKcHJvdG8gMiAxCmZyYW1lX2RpZyAtMgpmcmFtZV9kaWcgLTEKc2hyCmZyYW1lX2RpZyAtMgpmcmFtZV9kaWcgLTEKY2FsbHN1YiB0d29zY29tcGxlbWVudF84CnB1c2hpbnQgNjMgLy8gNjMKJgpzaGwKfApyZXRzdWIKCi8vIHBybmdfcm90YXRpb24KcHJuZ3JvdGF0aW9uXzEwOgpwcm90byAwIDEKbG9hZCAwCmV4dHJhY3QgMCA4CmJ0b2kKbG9hZCAwCmV4dHJhY3QgOCA4CmJ0b2kKXgpsb2FkIDAKZXh0cmFjdCAwIDEKYnRvaQpwdXNoaW50IDIgLy8gMgpzaHIKY2FsbHN1YiBwcm5ncm90YXRpb242NF85CnJldHN1YgoKLy8gcHJuZ19yYW5kaW50CnBybmdyYW5kaW50XzExOgpwcm90byAwIDEKY2FsbHN1YiBwcm5nc2V0c2Vxc3RlcF82CmNhbGxzdWIgcHJuZ3JvdGF0aW9uXzEwCnJldHN1YgoKLy8gY29tbWl0X2Nhc3Rlcgpjb21taXRjYXN0ZXJfMTI6CnByb3RvIDAgMAppbnRjXzAgLy8gMApkdXAKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQpidG9pCmZyYW1lX2J1cnkgMAp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCmludGNfMCAvLyAwCmV4dHJhY3RfdWludDE2CmZyYW1lX2J1cnkgMQpmcmFtZV9kaWcgMApmcmFtZV9kaWcgMQpjYWxsc3ViIGNvbW1pdF80CnJldHN1YgoKLy8gaW50ZWdlcnNfY2FzdGVyCmludGVnZXJzY2FzdGVyXzEzOgpwcm90byAwIDAKYnl0ZWNfMCAvLyAiIgppbnRjXzAgLy8gMApkdXAKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQpidG9pCmZyYW1lX2J1cnkgMQp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCmludGNfMCAvLyAwCmdldGJ5dGUKZnJhbWVfYnVyeSAyCmZyYW1lX2RpZyAxCmZyYW1lX2RpZyAyCmNhbGxzdWIgaW50ZWdlcnNfNQpmcmFtZV9idXJ5IDAKcHVzaGJ5dGVzIDB4MTUxZjdjNzUgLy8gMHgxNTFmN2M3NQpmcmFtZV9kaWcgMApjb25jYXQKbG9nCnJldHN1Yg==",
    "clear": "I3ByYWdtYSB2ZXJzaW9uIDgKcHVzaGludCAwIC8vIDAKcmV0dXJu"
  },
  "state": {
    "global": {
      "num_byte_slices": 63,
      "num_uints": 1
    },
    "local": {
      "num_byte_slices": 0,
      "num_uints": 0
    }
  },
  "schema": {
    "global": {
      "declared": {
        "randomness_beacon": {
          "type": "uint64",
          "key": "randomness_beacon",
          "descr": "Randomness beacon APP ID"
        }
      },
      "reserved": {
        "commitments": {
          "type": "bytes",
          "max_keys": 63,
          "descr": "Commitments to randomness"
        }
      }
    },
    "local": {
      "declared": {},
      "reserved": {}
    }
  },
  "contract": {
    "name": "verifiable_randomness",
    "methods": [
      {
        "name": "commit",
        "args": [
          {
            "type": "uint64",
            "name": "block_commitment"
          },
          {
            "type": "uint16",
            "name": "length"
          }
        ],
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "integers",
        "args": [
          {
            "type": "uint64",
            "name": "block_commitment"
          },
          {
            "type": "application",
            "name": "randomness_beacon"
          }
        ],
        "returns": {
          "type": "uint64[]"
        }
      }
    ],
    "networks": {}
  },
  "bare_call_config": {
    "delete_application": "CALL",
    "no_op": "CREATE",
    "update_application": "CALL"
  }
}

/**
 * Defines an onCompletionAction of 'no_op'
 */
export type OnCompleteNoOp =  { onCompleteAction?: 'no_op' | OnApplicationComplete.NoOpOC }
/**
 * Defines an onCompletionAction of 'opt_in'
 */
export type OnCompleteOptIn =  { onCompleteAction: 'opt_in' | OnApplicationComplete.OptInOC }
/**
 * Defines an onCompletionAction of 'close_out'
 */
export type OnCompleteCloseOut =  { onCompleteAction: 'close_out' | OnApplicationComplete.CloseOutOC }
/**
 * Defines an onCompletionAction of 'delete_application'
 */
export type OnCompleteDelApp =  { onCompleteAction: 'delete_application' | OnApplicationComplete.DeleteApplicationOC }
/**
 * Defines an onCompletionAction of 'update_application'
 */
export type OnCompleteUpdApp =  { onCompleteAction: 'update_application' | OnApplicationComplete.UpdateApplicationOC }
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
 * Defines the types of available calls and state of the VerifiableRandomness smart contract.
 */
export type VerifiableRandomness = {
  /**
   * Maps method signatures / names to their argument and return types.
   */
  methods:
    & Record<'commit(uint64,uint16)void' | 'commit', {
      argsObj: {
        block_commitment: bigint | number
        length: number
      }
      argsTuple: [block_commitment: bigint | number, length: number]
      returns: void
    }>
    & Record<'integers(uint64,application)uint64[]' | 'integers', {
      argsObj: {
        block_commitment: bigint | number
        randomness_beacon: number | bigint
      }
      argsTuple: [block_commitment: bigint | number, randomness_beacon: number | bigint]
      returns: bigint[]
    }>
  /**
   * Defines the shape of the global and local state of the application.
   */
  state: {
    global: {
      /**
       * Randomness beacon APP ID
       */
      'randomness_beacon'?: IntegerState
    }
  }
}
/**
 * Defines the possible abi call signatures
 */
export type VerifiableRandomnessSig = keyof VerifiableRandomness['methods']
/**
 * Defines an object containing all relevant parameters for a single call to the contract. Where TSignature is undefined, a bare call is made
 */
export type TypedCallParams<TSignature extends VerifiableRandomnessSig | undefined> = {
  method: TSignature
  methodArgs: TSignature extends undefined ? undefined : Array<ABIAppCallArg | undefined>
} & AppClientCallCoreParams & CoreAppCallArgs
/**
 * Defines the arguments required for a bare call
 */
export type BareCallArgs = Omit<RawAppCallArgs, keyof CoreAppCallArgs>
/**
 * Maps a method signature from the VerifiableRandomness smart contract to the method's arguments in either tuple of struct form
 */
export type MethodArgs<TSignature extends VerifiableRandomnessSig> = VerifiableRandomness['methods'][TSignature]['argsObj' | 'argsTuple']
/**
 * Maps a method signature from the VerifiableRandomness smart contract to the method's return type
 */
export type MethodReturn<TSignature extends VerifiableRandomnessSig> = VerifiableRandomness['methods'][TSignature]['returns']

/**
 * A factory for available 'create' calls
 */
export type VerifiableRandomnessCreateCalls = (typeof VerifiableRandomnessCallFactory)['create']
/**
 * Defines supported create methods for this smart contract
 */
export type VerifiableRandomnessCreateCallParams =
  | (TypedCallParams<undefined> & (OnCompleteNoOp))
/**
 * A factory for available 'update' calls
 */
export type VerifiableRandomnessUpdateCalls = (typeof VerifiableRandomnessCallFactory)['update']
/**
 * Defines supported update methods for this smart contract
 */
export type VerifiableRandomnessUpdateCallParams =
  | TypedCallParams<undefined>
/**
 * A factory for available 'delete' calls
 */
export type VerifiableRandomnessDeleteCalls = (typeof VerifiableRandomnessCallFactory)['delete']
/**
 * Defines supported delete methods for this smart contract
 */
export type VerifiableRandomnessDeleteCallParams =
  | TypedCallParams<undefined>
/**
 * Defines arguments required for the deploy method.
 */
export type VerifiableRandomnessDeployArgs = {
  deployTimeParams?: TealTemplateParams
  /**
   * A delegate which takes a create call factory and returns the create call params for this smart contract
   */
  createCall?: (callFactory: VerifiableRandomnessCreateCalls) => VerifiableRandomnessCreateCallParams
  /**
   * A delegate which takes a update call factory and returns the update call params for this smart contract
   */
  updateCall?: (callFactory: VerifiableRandomnessUpdateCalls) => VerifiableRandomnessUpdateCallParams
  /**
   * A delegate which takes a delete call factory and returns the delete call params for this smart contract
   */
  deleteCall?: (callFactory: VerifiableRandomnessDeleteCalls) => VerifiableRandomnessDeleteCallParams
}


/**
 * Exposes methods for constructing all available smart contract calls
 */
export abstract class VerifiableRandomnessCallFactory {
  /**
   * Gets available create call factories
   */
  static get create() {
    return {
      /**
       * Constructs a create call for the verifiable_randomness smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams & (OnCompleteNoOp) = {}) {
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
       * Constructs an update call for the verifiable_randomness smart contract using a bare call
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
       * Constructs a delete call for the verifiable_randomness smart contract using a bare call
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
   * Constructs a no op call for the commit(uint64,uint16)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static commit(args: MethodArgs<'commit(uint64,uint16)void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'commit(uint64,uint16)void' as const,
      methodArgs: Array.isArray(args) ? args : [args.block_commitment, args.length],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the integers(uint64,application)uint64[] ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static integers(args: MethodArgs<'integers(uint64,application)uint64[]'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'integers(uint64,application)uint64[]' as const,
      methodArgs: Array.isArray(args) ? args : [args.block_commitment, args.randomness_beacon],
      ...params,
    }
  }
}

/**
 * A client to make calls to the verifiable_randomness smart contract
 */
export class VerifiableRandomnessClient {
  /**
   * The underlying `ApplicationClient` for when you want to have more flexibility
   */
  public readonly appClient: ApplicationClient

  private readonly sender: SendTransactionFrom | undefined

  /**
   * Creates a new instance of `VerifiableRandomnessClient`
   *
   * @param appDetails appDetails The details to identify the app to deploy
   * @param algod An algod client instance
   */
  constructor(appDetails: AppDetails, private algod: Algodv2) {
    this.sender = appDetails.sender
    this.appClient = algokit.getAppClient({
      ...appDetails,
      app: APP_SPEC
    }, algod)
  }

  /**
   * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
   *
   * @param result The AppCallTransactionResult to be mapped
   * @param returnValueFormatter An optional delegate to format the return value if required
   * @returns The smart contract response with an updated return value
   */
  protected mapReturnValue<TReturn>(result: AppCallTransactionResult, returnValueFormatter?: (value: any) => TReturn): AppCallTransactionResultOfType<TReturn> {
    if(result.return?.decodeError) {
      throw result.return.decodeError
    }
    const returnValue = result.return?.returnValue !== undefined && returnValueFormatter !== undefined
      ? returnValueFormatter(result.return.returnValue)
      : result.return?.returnValue as TReturn | undefined
      return { ...result, return: returnValue }
  }

  /**
   * Calls the ABI method with the matching signature using an onCompletion code of NO_OP
   *
   * @param typedCallParams An object containing the method signature, args, and any other relevant parameters
   * @param returnValueFormatter An optional delegate which when provided will be used to map non-undefined return values to the target type
   * @returns The result of the smart contract call
   */
  public async call<TSignature extends keyof VerifiableRandomness['methods']>(typedCallParams: TypedCallParams<TSignature>, returnValueFormatter?: (value: any) => MethodReturn<TSignature>) {
    return this.mapReturnValue<MethodReturn<TSignature>>(await this.appClient.call(typedCallParams), returnValueFormatter)
  }

  /**
   * Idempotently deploys the verifiable_randomness smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  public deploy(params: VerifiableRandomnessDeployArgs & AppClientDeployCoreParams = {}): ReturnType<ApplicationClient['deploy']> {
    const createArgs = params.createCall?.(VerifiableRandomnessCallFactory.create)
    const updateArgs = params.updateCall?.(VerifiableRandomnessCallFactory.update)
    const deleteArgs = params.deleteCall?.(VerifiableRandomnessCallFactory.delete)
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
       * Creates a new instance of the verifiable_randomness smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The create result
       */
      bare(args: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs & (OnCompleteNoOp) = {}): Promise<AppCallTransactionResultOfType<undefined>> {
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
       * Updates an existing instance of the verifiable_randomness smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The update result
       */
      bare(args: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs = {}): Promise<AppCallTransactionResultOfType<undefined>> {
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
       * Deletes an existing instance of the verifiable_randomness smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The delete result
       */
      bare(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}): Promise<AppCallTransactionResultOfType<undefined>> {
        return $this.appClient.delete(args) as unknown as Promise<AppCallTransactionResultOfType<undefined>>
      },
    }
  }

  /**
   * Makes a clear_state call to an existing instance of the verifiable_randomness smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The clear_state result
   */
  public clearState(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.appClient.clearState(args)
  }

  /**
   * Calls the commit(uint64,uint16)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public commit(args: MethodArgs<'commit(uint64,uint16)void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(VerifiableRandomnessCallFactory.commit(args, params))
  }

  /**
   * Calls the integers(uint64,application)uint64[] ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public integers(args: MethodArgs<'integers(uint64,application)uint64[]'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(VerifiableRandomnessCallFactory.integers(args, params))
  }

  /**
   * Extracts a binary state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns A BinaryState instance containing the state value, or undefined if the key was not found
   */
  private static getBinaryState(state: AppState, key: string): BinaryState | undefined {
    const value = state[key]
    if (!value) return undefined
    if (!('valueRaw' in value))
      throw new Error(`Failed to parse state value for ${key}; received an int when expected a byte array`)
    return {
      asString(): string {
        return value.value
      },
      asByteArray(): Uint8Array {
        return value.valueRaw
      }
    }
  }

  /**
   * Extracts a integer state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns An IntegerState instance containing the state value, or undefined if the key was not found
   */
  private static getIntegerState(state: AppState, key: string): IntegerState | undefined {
    const value = state[key]
    if (!value) return undefined
    if ('valueRaw' in value)
      throw new Error(`Failed to parse state value for ${key}; received a byte array when expected a number`)
    return {
      asBigInt() {
        return typeof value.value === 'bigint' ? value.value : BigInt(value.value)
      },
      asNumber(): number {
        return typeof value.value === 'bigint' ? Number(value.value) : value.value
      },
    }
  }

  /**
   * Returns the smart contract's global state wrapped in a strongly typed accessor with options to format the stored value
   */
  public async getGlobalState(): Promise<VerifiableRandomness['state']['global']> {
    const state = await this.appClient.getGlobalState()
    return {
      get randomness_beacon() {
        return VerifiableRandomnessClient.getIntegerState(state, 'randomness_beacon')
      },
    }
  }

  public compose(): VerifiableRandomnessComposer {
    const client = this
    const atc = new AtomicTransactionComposer()
    let promiseChain:Promise<unknown> = Promise.resolve()
    const resultMappers: Array<undefined | ((x: any) => any)> = []
    return {
      commit(args: MethodArgs<'commit(uint64,uint16)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.commit(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      integers(args: MethodArgs<'integers(uint64,application)uint64[]'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.integers(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      get update() {
        const $this = this
        return {
          bare(args?: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs) {
            promiseChain = promiseChain.then(() => client.update.bare({...args, sendParams: {...args?.sendParams, skipSending: true, atc}}))
            resultMappers.push(undefined)
            return $this
          },
        }
      },
      get delete() {
        const $this = this
        return {
          bare(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs) {
            promiseChain = promiseChain.then(() => client.delete.bare({...args, sendParams: {...args?.sendParams, skipSending: true, atc}}))
            resultMappers.push(undefined)
            return $this
          },
        }
      },
      clearState(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.clearState({...args, sendParams: {...args?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom) {
        promiseChain = promiseChain.then(async () => atc.addTransaction(await algokit.getTransactionWithSigner(txn, defaultSender ?? client.sender)))
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
          returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)
        }
      }
    } as unknown as VerifiableRandomnessComposer
  }
}
export type VerifiableRandomnessComposer<TReturns extends [...any[]] = []> = {
  /**
   * Calls the commit(uint64,uint16)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  commit(args: MethodArgs<'commit(uint64,uint16)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs): VerifiableRandomnessComposer<[...TReturns, MethodReturn<'commit(uint64,uint16)void'>]>

  /**
   * Calls the integers(uint64,application)uint64[] ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  integers(args: MethodArgs<'integers(uint64,application)uint64[]'>, params?: AppClientCallCoreParams & CoreAppCallArgs): VerifiableRandomnessComposer<[...TReturns, MethodReturn<'integers(uint64,application)uint64[]'>]>

  /**
   * Gets available update methods
   */
  readonly update: {
    /**
     * Updates an existing instance of the verifiable_randomness smart contract using a bare call.
     *
     * @param args The arguments for the bare call
     * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
     */
    bare(args?: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs): VerifiableRandomnessComposer<[...TReturns, undefined]>
  }

  /**
   * Gets available delete methods
   */
  readonly delete: {
    /**
     * Deletes an existing instance of the verifiable_randomness smart contract using a bare call.
     *
     * @param args The arguments for the bare call
     * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
     */
    bare(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs): VerifiableRandomnessComposer<[...TReturns, undefined]>
  }

  /**
   * Makes a clear_state call to an existing instance of the verifiable_randomness smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  clearState(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs): VerifiableRandomnessComposer<[...TReturns, undefined]>

  /**
   * Adds a transaction to the composer
   *
   * @param txn One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by one of algokit utils helpers (signer is obtained from the defaultSender parameter)
   * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not include a signer.
   */
  addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom): VerifiableRandomnessComposer<TReturns>
  /**
   * Returns the underlying AtomicTransactionComposer instance
   */
  atc(): Promise<AtomicTransactionComposer>
  /**
   * Simulates the transaction group and returns the result
   */
  simulate(): Promise<VerifiableRandomnessComposerSimulateResult>
  /**
   * Executes the transaction group and returns the results
   */
  execute(): Promise<VerifiableRandomnessComposerResults<TReturns>>
}
export type VerifiableRandomnessComposerSimulateResult = {
  methodResults: ABIResult[]
  simulateResponse: modelsv2.SimulateResponse
}
export type VerifiableRandomnessComposerResults<TReturns extends [...any[]]> = {
  returns: TReturns
  groupId: string
  txIds: string[]
  transactions: Transaction[]
}
