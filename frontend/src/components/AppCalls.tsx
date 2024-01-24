import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { VerifiableRandomnessClient } from '../contracts/verifiable_randomness'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { useImmer } from 'use-immer'

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

    // Please note, in typical production scenarios,
    // you wouldn't want to use deploy directly from your frontend.
    // Instead, you would deploy your contract on your backend and reference it by id.
    // Given the simplicity of the starter contract, we are deploying it on the frontend
    // for demonstration purposes.
    // const isLocal = await algokit.isLocalNet(algodClient)
    // const deployParams: Parameters<typeof appClient.deploy>[0] = {
    //   allowDelete: isLocal,
    //   allowUpdate: isLocal,
    //   onSchemaBreak: isLocal ? 'replace' : 'fail',
    //   onUpdate: isLocal ? 'update' : 'fail',
    // }
    // await appClient.deploy(deployParams).catch((e: Error) => {
    //   enqueueSnackbar(`Error deploying the contract: ${e.message}`, { variant: 'error' })
    //   setLoading(false)
    //   return
    // })

    if (integersArgs.round === undefined || integersArgs.length === undefined) {
      enqueueSnackbar('Must set at least round and length fields', { variant: 'error' })
    } else {
      const response = await appClient.integers({
        round: integersArgs.round,
        user_data: integersArgs.user_data || new Uint8Array(),
        randomness_beacon: BigInt(import.meta.env.VITE_RANDOMNESS_BEACON_ID),
        length: integersArgs.length,
      })
      enqueueSnackbar(`Response from the contract: ${response?.return}`, { variant: 'success' })
    }

    setLoading(false)
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Extract a sequence of random uint64</h3>
        <br />
        <input
          type="text"
          placeholder="Round number"
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
