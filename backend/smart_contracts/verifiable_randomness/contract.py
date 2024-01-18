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
        # prng_init(
        #     pt.Substring(pt.InnerTxn.last_log(), pt.Int(4), pt.Int(16+4)),
        #     pt.Substring(pt.InnerTxn.last_log(), pt.Int(16+4), pt.Int(2*16+4))
        # ),
        prng_init(
            pt.Bytes(b"\x00\x00\x00\x00\x00\x00\x00\x00"),
            pt.Bytes(b"\x00\x00\x00\x00\x00\x00\x00\x00"),
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


PRNG_STATE_LENGTH = pt.Bytes(b"\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00")  # == 2^128
PRNG_DEFAULT_MULTIPLIER = pt.Bytes(b"\x23\x60\xed\x05\x1f\xc6\x5d\xa4\x43\x85\xdf\x64\x9f\xcc\xf6\x45")
PRNG_STATE = pt.ScratchVar(pt.TealType.bytes)
PRNG_INC = pt.ScratchVar(pt.TealType.bytes)


# https://github.com/imneme/pcg-c/blob/83252d9c23df9c82ecb42210afed61a7b42402d7/include/pcg_variants.h#L650
@pt.Subroutine(pt.TealType.none)
def prng_setseq_step() -> pt.Expr:
    return PRNG_STATE.store(
        # L652
        pt.BytesMod(
            pt.BytesAdd(
                pt.BytesMul(
                    PRNG_STATE.load(),
                    PRNG_DEFAULT_MULTIPLIER
                ),
                PRNG_INC.load()
            ),
            PRNG_STATE_LENGTH
        )
    )


# https://github.com/imneme/pcg-c/blob/83252d9c23df9c82ecb42210afed61a7b42402d7/include/pcg_variants.h#L830
@pt.Subroutine(pt.TealType.none)
def prng_init(initstate, initseq) -> pt.Expr:
    return pt.Seq(
        # L833
        PRNG_STATE.store(pt.Bytes(b"\x00\x00\x00\x00\x00\x00\x00\x00")),

        # L834
        PRNG_INC.store(
            pt.BytesMod(
                pt.BytesAdd(
                    pt.BytesMul(
                        initseq,
                        pt.Bytes(b"\x00\x00\x00\x00\x00\x00\x00\x02")
                    ),
                    pt.Bytes(b"\x00\x00\x00\x00\x00\x00\x00\x01")
                ),
                PRNG_STATE_LENGTH
            )
        ),

        # L835
        prng_setseq_step(),

        # L836
        PRNG_STATE.store(
            pt.BytesMod(
                pt.BytesAdd(
                    PRNG_STATE.load(),
                    initstate
                ),
                PRNG_STATE_LENGTH
            )
        ),

        # L837
        prng_setseq_step(),
    )


@pt.Subroutine(pt.TealType.uint64)
def twos_complement(value) -> pt.Expr:
    temp = pt.ScratchVar(pt.TealType.bytes)

    return pt.Seq(
        temp.store(
            pt.BytesAdd(
                pt.BytesNot(pt.Itob(value)),
                pt.Bytes(b"\x00\x00\x00\x00\x00\x00\x00\x01")
            )
        ),
        pt.If(pt.Len(temp.load()) == pt.Int(8))
        .Then(pt.Return(pt.Btoi(temp.load())))
        .Else(pt.Return(pt.ExtractUint64(temp.load(), pt.Int(1))))
    )


# https://github.com/imneme/pcg-c/blob/master/include/pcg_variants.h#L96
@pt.Subroutine(pt.TealType.uint64)
def __prng_rotation_64(value, rot) -> pt.Expr:
    # L104 good luck.
    return pt.Seq(
        pt.Return(pt.BitwiseOr(
            pt.ShiftRight(
                value,
                rot
            ),
            pt.ShiftLeft(
                value,
                pt.BitwiseAnd(
                    twos_complement(rot),
                    pt.Int(63)
                )
            )
        ))
    )


# https://github.com/imneme/pcg-c/blob/master/include/pcg_variants.h#L243
@pt.Subroutine(pt.TealType.uint64)
def prng_rotation() -> pt.Expr:
    return __prng_rotation_64(
        pt.BitwiseXor(
            pt.Btoi(pt.Substring(PRNG_STATE.load(), pt.Int(0), pt.Int(8))),
            pt.Btoi(pt.Substring(PRNG_STATE.load(), pt.Int(8), pt.Int(16))),
        ),
        pt.ShiftRight(
            pt.Btoi(pt.Substring(PRNG_STATE.load(), pt.Int(0), pt.Int(1))),
            pt.Int(2)
        )
    )


# https://github.com/imneme/pcg-c/blob/83252d9c23df9c82ecb42210afed61a7b42402d7/include/pcg_variants.h#L2185
@pt.Subroutine(pt.TealType.uint64)
def prng_randint() -> pt.Expr:
    return pt.Seq(
        # L2187
        prng_setseq_step(),

        # L2188
        pt.Return(prng_rotation())
    )
