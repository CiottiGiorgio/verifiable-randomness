import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { VerifiableRandomnessClient } from '../contracts/verifiable_randomness'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { useImmer } from 'use-immer'
import { microAlgos } from '@algorandfoundation/algokit-utils'
import { makeEmptyTransactionSigner } from 'algosdk'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [integersArgs, updateIntegersArgs] = useImmer<{
    round?: number
    user_data?: Uint8Array
    length?: number
  }>({})

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algodClient = algokit.getAlgoClient({
    server: algodConfig.server,
    port: algodConfig.port,
    token: algodConfig.token,
  })

  const { enqueueSnackbar } = useSnackbar()
  const { signer, activeAddress } = useWallet()

  const sendAppCall = async () => {
    setLoading(true)

    const appDetails = {
      resolveBy: 'id',
      id: BigInt(import.meta.env.VITE_VERIFIABLE_RANDOMNESS_ID),
      sender: { signer, addr: activeAddress } as TransactionSignerAccount,
    } as AppDetails

    const appClient = new VerifiableRandomnessClient(appDetails, algodClient)

    if (integersArgs.round === undefined || integersArgs.length === undefined) {
      enqueueSnackbar('Must set at least round and length fields', { variant: 'error' })
    } else {
      try {
        const response = await appClient
          .compose()
          .integers(
            {
              round: integersArgs.round,
              user_data: integersArgs.user_data || new Uint8Array(),
              randomness_beacon: BigInt(import.meta.env.VITE_RANDOMNESS_BEACON_ID),
              length: integersArgs.length,
            },
            {
              sender: {
                addr: activeAddress!,
                signer: makeEmptyTransactionSigner(),
              },
              // This call uses OpUp utility to ensure at least 150 opcode budget for each number.
              // We are going to make a generous approximation.
              sendParams: { fee: microAlgos((Math.floor((integersArgs.length * 150) / 700) + 2) * 1_000) },
            },
          )
          .simulate({
            allowEmptySignatures: true,
          })
        enqueueSnackbar(`Response from the contract: ${response.methodResults[0].returnValue}`, { variant: 'success' })
      } catch (e) {
        enqueueSnackbar(`Error on integers method call: ${e}`, { variant: 'error' })
      }
    }

    setLoading(false)
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Extract a sequence of random uint64</h3>
        <p className="py-6">
          Round and Sequence length are mandatory fields. Use User data if you need to differentiate between equal queries.
        </p>
        <br />
        <input
          type="text"
          placeholder="Round"
          className="input input-bordered w-full"
          // value={integersArgs.round}
          onChange={(e) => {
            updateIntegersArgs((draft) => {
              draft.round = parseInt(e.target.value)
            })
          }}
        />
        <input
          type="text"
          placeholder="User data"
          className="input input-bordered w-full"
          // value={integersArgs.user_data}
          onChange={(e) => {
            updateIntegersArgs((draft) => {
              draft.user_data = Buffer.from(e.target.value)
            })
          }}
        />
        <input
          type="text"
          placeholder="Sequence length"
          className="input input-bordered w-full"
          // value={integersArgs.length}
          onChange={(e) => {
            updateIntegersArgs((draft) => {
              draft.length = parseInt(e.target.value)
            })
          }}
        />
        <div className="modal-action ">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Close
          </button>
          <button className={`btn`} onClick={sendAppCall}>
            {loading ? <span className="loading loading-spinner" /> : 'Send application call'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AppCalls
