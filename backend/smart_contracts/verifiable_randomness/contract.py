import beaker
import pyteal as pt
from algokit_utils import DELETABLE_TEMPLATE_NAME, UPDATABLE_TEMPLATE_NAME

from smart_contracts.pcg_xsl_rr_128_64.lib import prng_init, prng_randint


class VerifiableRandomnessState:
    randomness_beacon = beaker.state.GlobalStateValue(
        stack_type=pt.TealType.uint64,
        default=pt.Tmpl.Int("TMPL_RANDOMNESS_BEACON_APP_ID"),
        static=True,
        descr="Randomness beacon APP ID",
    )
    commitments = beaker.state.ReservedGlobalStateValue(
        stack_type=pt.TealType.bytes, max_keys=63, descr="Commitments to randomness"
    )


app = beaker.Application(
    "verifiable_randomness", state=VerifiableRandomnessState()
).apply(beaker.unconditional_create_approval, initialize_global_state=True)


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
def integers(
    round: pt.abi.Uint64,  # noqa: A002
    user_data: pt.abi.DynamicBytes,
    randomness_beacon: pt.abi.Application,
    length: pt.abi.Uint16,
    *,
    output: pt.abi.DynamicArray[pt.abi.Uint64],
) -> pt.Expr:
    opup = pt.OpUp(pt.OpUpMode.OnCall)

    i = pt.ScratchVar(pt.TealType.uint64)
    random_uints = pt.ScratchVar(pt.TealType.bytes)

    return pt.Seq(
        pt.InnerTxnBuilder.ExecuteMethodCall(
            app_id=app.state.randomness_beacon.get(),
            method_signature="must_get(uint64,byte[])byte[]",
            args=[round, user_data],
        ),
        # This costs roughly 200 opcode budget.
        prng_init(
            pt.Substring(pt.InnerTxn.last_log(), pt.Int(6), pt.Int(16 + 6)),
            pt.Substring(pt.InnerTxn.last_log(), pt.Int(16 + 4), pt.Int(2 * 16 + 6)),
        ),
        pt.For(
            pt.Seq(i.store(pt.Int(0)), random_uints.store(pt.Bytes(b""))),
            i.load() < length.get(),
            i.store(i.load() + pt.Int(1)),
        ).Do(
            pt.Seq(
                # Based on the cost of generating a new number, let's say we need at least 150 opcode budget to get
                #  to the next iteration
                opup.ensure_budget(pt.Int(150)),
                # prng_randint costs about 110 opcode budget.
                random_uints.store(
                    pt.Concat(random_uints.load(), pt.Itob(prng_randint()))
                ),
            )
        ),
        output.decode(
            pt.Concat(
                length.encode(),
                random_uints.load(),
            )
        ),
    )
