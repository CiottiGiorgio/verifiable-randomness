import beaker
import pyteal as pt
from algokit_utils import DELETABLE_TEMPLATE_NAME, UPDATABLE_TEMPLATE_NAME

from smart_contracts.pcg_xsl_rr_128_64.lib import prng_init, prng_randint


class VerifiableRandomnessState:
    randomness_beacon = beaker.state.GlobalStateValue(
        stack_type=pt.TealType.uint64,
        default=pt.Tmpl.Int("TMPL_RANDOMNESS_BEACON_APP_ID"),
        static=True,
        descr="Randomness beacon APP ID"
    )
    commitments = beaker.state.ReservedGlobalStateValue(
        stack_type=pt.TealType.bytes,
        max_keys=63,
        descr="Commitments to randomness"
    )


app = (
    beaker.Application("verifiable_randomness", state=VerifiableRandomnessState())
    .apply(beaker.unconditional_create_approval, initialize_global_state=True)
)


@app.update(authorize=beaker.Authorize.only_creator(), bare=True)
def update() -> pt.Expr:
    return pt.Assert(
        pt.Tmpl.Int(UPDATABLE_TEMPLATE_NAME),
        comment="Check app is updatable",
    )


@app.delete(authorize=beaker.Authorize.only_creator(), bare=True)
def delete() -> pt.Expr:
    return pt.Assert(
        pt.Tmpl.Int(DELETABLE_TEMPLATE_NAME),
        comment="Check app is deletable",
    )


@app.external
def commit(block_commitment: pt.abi.Uint64, length: pt.abi.Uint16) -> pt.Expr:
    return pt.Seq(
        pt.Assert(block_commitment.get() > pt.Global.round()),
        app.state.commitments[block_commitment.encode()].set(length.encode()),
    )


@app.external
def integers(
    block_commitment: pt.abi.Uint64,
    randomness_beacon: pt.abi.Application,
    *,
    output: pt.abi.DynamicArray[pt.abi.Uint64]
) -> pt.Expr:
    length = pt.abi.Uint16()

    i = pt.ScratchVar(pt.TealType.uint64)
    random_ints = pt.ScratchVar(pt.TealType.bytes)

    return pt.Seq(
        pt.Assert(block_commitment.get() <= pt.Global.round()),
        length.decode(app.state.commitments[block_commitment.encode()]),

        (user_data := pt.abi.DynamicBytes()).set(pt.Bytes("")),
        pt.InnerTxnBuilder.ExecuteMethodCall(
            app_id=app.state.randomness_beacon.get(),
            method_signature="get(uint64,byte[])byte[]",
            args=[block_commitment, user_data]
        ),
        prng_init(
            pt.Substring(pt.InnerTxn.last_log(), pt.Int(4), pt.Int(16+4)),
            pt.Substring(pt.InnerTxn.last_log(), pt.Int(16+4), pt.Int(2*16+4))
        ),

        pt.For(
            pt.Seq(
                i.store(pt.Int(0)),
                random_ints.store(pt.Bytes(""))
            ),
            i.load() < length.get(),
            i.store(i.load() + pt.Int(1))
        ).Do(pt.Seq(
            random_ints.store(pt.Concat(random_ints.load(), pt.Itob(prng_randint())))
        )),

        output.decode(pt.Concat(length.encode(), random_ints.load()))
    )
