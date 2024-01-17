import beaker
import pyteal as pt
from algokit_utils import DELETABLE_TEMPLATE_NAME, UPDATABLE_TEMPLATE_NAME


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
def hello(name: pt.abi.String, *, output: pt.abi.String) -> pt.Expr:
    return output.set(pt.Concat(pt.Bytes("Hello, "), name.get()))


@app.external
def commit(block_commitment: pt.abi.Uint64, length: pt.abi.Uint64) -> pt.Expr:
    return pt.Seq(
        pt.Assert(block_commitment.get() > pt.Global.round()),
        app.state.commitments[block_commitment.get()].set(length.encode()),
    )


@app.external
def integers(block_commitment: pt.abi.Uint64, randomness_beacon: pt.abi.Application) -> pt.Expr:
    length = pt.abi.Uint64()

    return pt.Seq(
        pt.Assert(block_commitment.get() <= pt.Global.round()),
        length.decode(app.state.commitments[block_commitment.get()]),
        # TODO:
        # - Call randomness beacon for a seed
        # - generate a sequence of length "length" of uint64 by iterating hash functions
    )
