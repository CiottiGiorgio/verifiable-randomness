import * as algokit from '@algorandfoundation/algokit-utils'
import { VerifiableRandomnessClient } from '../artifacts/verifiable_randomness/client'
import { isTestNet } from '@algorandfoundation/algokit-utils'

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying VerifiableRandomness ===')

  const algod = algokit.getAlgoClient()
  const indexer = algokit.getAlgoIndexerClient()
  const deployer = await algokit.mnemonicAccountFromEnvironment({ name: 'DEPLOYER', fundWith: algokit.algos(3) }, algod)
  await algokit.ensureFunded(
    {
      accountToFund: deployer,
      minSpendingBalance: algokit.algos(2),
      minFundingIncrement: algokit.algos(2),
    },
    algod,
  )
  const appClient = new VerifiableRandomnessClient(
    {
      resolveBy: 'creatorAndName',
      findExistingUsing: indexer,
      sender: deployer,
      creatorAddress: deployer.addr,
    },
    algod,
  )
  const isMainNet = await algokit.isMainNet(algod)
  const app = await appClient.deploy({
    allowDelete: !isMainNet,
    allowUpdate: !isMainNet,
    onSchemaBreak: isMainNet ? 'append' : 'replace',
    onUpdate: isMainNet ? 'append' : 'update',
    deployTimeParams: {
      TMPL_RANDOMNESS_BEACON_APP_ID: isMainNet ? 947957720 : 110096026,
    },
  })

  // If app was just created fund the app account
  if (['create', 'replace'].includes(app.operationPerformed)) {
    await algokit.transferAlgos(
      {
        amount: algokit.algos(1),
        from: deployer,
        to: app.appAddress,
      },
      algod,
    )
  }
}
