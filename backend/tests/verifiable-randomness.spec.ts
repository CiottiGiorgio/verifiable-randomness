import { createHash } from 'crypto'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { VerifiableRandomnessClient } from '../smart_contracts/artifacts/verifiable_randomness/client'
import { MockRandomnessBeaconClient } from '../smart_contracts/artifacts/mock_randomness_beacon/client'
import { Account, Algodv2, Indexer } from 'algosdk'
import * as algokit from '@algorandfoundation/algokit-utils'
import { microAlgos } from '@algorandfoundation/algokit-utils'

describe('verifiable randomness contract', () => {
  const localnet = algorandFixture()
  beforeAll(() => {
    algokit.Config.configure({
      debug: false,
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
    const mockVRFOutput = createHash('sha3-256').update('not-so-random seed').digest()
    const mockRBDeployment = await mockRBClient.deploy({
      allowDelete: true,
      allowUpdate: true,
      onSchemaBreak: 'replace',
      onUpdate: 'update',
      deployTimeParams: {
        TMPL_MOCK_VRF_OUTPUT: mockVRFOutput,
      },
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
        TMPL_RANDOMNESS_BEACON_APP_ID: mockRBDeployment.appId,
      },
    })

    return { client: VRClient, mRBID: mockRBDeployment.appId }
  }

  test('commits and extracts randomness', async () => {
      const { algod, indexer, testAccount } = localnet.context
      const { client, mRBID } = await deploy(testAccount, algod, indexer)

      const currentStatus = await algod.status().do()
      await client.commit({
        block_commitment: currentStatus['last-round'] + 2,
        length: 125,
      })

      const result = await client.integers(
        {
          block_commitment: currentStatus['last-round'] + 2,
          randomness_beacon: mRBID,
        },
        {
          sendParams: {
            fee: microAlgos(30e3),
          },
        },
      )

      expect(result.return).toStrictEqual([
        12839743382076751087n,
        7098826999949041455n,
        2876043800098693296n,
        7657454681114381757n,
        9826923162219096769n,
        2859254809545779259n,
        8761769523789107317n,
        76006634920023400n,
        10800970818882262818n,
        17431514683931970119n,
        17370328221989822972n,
        3539832833120960483n,
        14422949648317260175n,
        15592803346563979633n,
        7634187873474092803n,
        13863802121878558809n,
        16123950124693642544n,
        5143689260508504180n,
        7660215016608247432n,
        3396389192399339338n,
        5715525410704619909n,
        369259515501772127n,
        4763592765220964816n,
        13784801174725667820n,
        569237081533865357n,
        11264555975562964306n,
        16151570268702982346n,
        4852871054602208628n,
        1550393343431174283n,
        6946955660551917487n,
        7683491023287902617n,
        11221534507338772195n,
        13574657908559156515n,
        13433745768941096259n,
        18203107890048226743n,
        14223760077778110793n,
        4372101630268325741n,
        17027534739080114790n,
        2622855396412377971n,
        6364474922294552358n,
        12719700777606899020n,
        2810347765737726446n,
        1692193390927532103n,
        18105894117113193918n,
        10311638509837000402n,
        5994166399072308522n,
        13410187805814208817n,
        2633579403741750238n,
        624561629038185027n,
        16708252758741760055n,
        7992584544231749534n,
        3972154657764850072n,
        13143291783405835973n,
        14211324927772155712n,
        7921454399477380703n,
        18108761585443149980n,
        11924321654455194772n,
        14933075535299738280n,
        9826634629457713623n,
        14841624792053306553n,
        221694947853351688n,
        9855152413312761560n,
        13884759510940962667n,
        4106663443602763454n,
        17613761604021697705n,
        13229335553647788233n,
        10658569570330801459n,
        10150592802665200456n,
        3578701383225543130n,
        3982283665239385454n,
        15789550748235269450n,
        17784302805565805741n,
        9738807585260798606n,
        2600461224667608476n,
        11254481673365343415n,
        16629216995467136989n,
        17428301379011808689n,
        14606882842905973147n,
        4935678260995595459n,
        17255281929516714443n,
        18148357674770001972n,
        929670394247548473n,
        4176063468104349997n,
        4489330906307376144n,
        12078581368285265518n,
        3343231018792912091n,
        1555073024198935039n,
        4679311643044663762n,
        15694976377016887196n,
        6365456330937989646n,
        15341593835602579675n,
        359064862667927732n,
        4938825836015199617n,
        8720800375957598898n,
        11622090973195379276n,
        12715817566948888667n,
        3961706522046587863n,
        839115009634382512n,
        14448023907288961271n,
        11698920475207631355n,
        2899179344630074158n,
        11662301335707731887n,
        4976396660511529385n,
        13472427213215593687n,
        15735184792830161099n,
        7045368032044497332n,
        14801669799301474638n,
        1255046351867964945n,
        16349344773217140943n,
        2952280336853641122n,
        13665653457579184134n,
        4889304103301186317n,
        12608680951310230782n,
        14050885348171576819n,
        12692563504579810732n,
        8597915857004124814n,
        10286612579929455763n,
        5632412088215617003n,
        8257191932367263016n,
        15706829504179810891n,
        7836677703404310401n,
        5278919918083063574n,
        17211161635101346132n,
        6645770991758305913n,
        12266635287136352058n
      ])
    },
    10e6,
  )
})
