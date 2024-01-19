import pyteal as pt


PRNG_STATE_LENGTH = pt.Bytes(b"\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00")  # == 2^128
PRNG_DEFAULT_MULTIPLIER = pt.Bytes(b"\x23\x60\xed\x05\x1f\xc6\x5d\xa4\x43\x85\xdf\x64\x9f\xcc\xf6\x45")
PRNG_STATE = pt.ScratchVar(pt.TealType.bytes)
PRNG_INC = pt.ScratchVar(pt.TealType.bytes)


# Best case cost analysis:
# tot: 2 * BytesMod + 2 * BytesAdd + BytesMul + 2 * step + single cost opcodes =
# = 40 + 20 + 20 + 110 + 10 = 200 opcode budget
# https://github.com/imneme/pcg-c/blob/83252d9c23df9c82ecb42210afed61a7b42402d7/include/pcg_variants.h#L830
@pt.Subroutine(pt.TealType.none)
def prng_init(initstate, initseq) -> pt.Expr:
    return pt.Seq(
        # L833
        PRNG_STATE.store(pt.Bytes(b"\x00")),

        # L834
        PRNG_INC.store(
            pt.BytesMod(
                pt.BytesAdd(
                    pt.BytesMul(
                        initseq,
                        pt.Bytes(b"\x02")
                    ),
                    pt.Bytes(b"\x01")
                ),
                PRNG_STATE_LENGTH
            )
        ),

        # L835
        __prng_setseq_step(),

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
        __prng_setseq_step(),
    )


# Best case cost analysis:
# tot: step + rotation + single cost opcodes = 55 + 50 + 3 = 108 opcode budget
# https://github.com/imneme/pcg-c/blob/83252d9c23df9c82ecb42210afed61a7b42402d7/include/pcg_variants.h#L2185
@pt.Subroutine(pt.TealType.uint64)
def prng_randint() -> pt.Expr:
    return pt.Seq(
        # L2187
        __prng_setseq_step(),

        # L2188
        pt.Return(__prng_rotation())
    )


# Best case cost analysis:
# tot: BytesMod + BytesAdd + BytesMul + single cost opcodes = 20 + 10 + 20 + 5 = 55 opcode budget
# https://github.com/imneme/pcg-c/blob/83252d9c23df9c82ecb42210afed61a7b42402d7/include/pcg_variants.h#L650
@pt.Subroutine(pt.TealType.none)
def __prng_setseq_step() -> pt.Expr:
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


# Best case cost analysis:
# tot: BytesAdd + BytesNot + single cost opcodes = 10 + 4 + 9 = 23 opcode budget
@pt.Subroutine(pt.TealType.uint64)
def __twos_complement(value) -> pt.Expr:
    temp = pt.ScratchVar(pt.TealType.bytes)

    return pt.Seq(
        temp.store(
            pt.BytesAdd(
                pt.BytesNot(pt.Itob(value)),
                pt.Bytes(b"\x01")
            )
        ),
        pt.If(pt.Len(temp.load()) == pt.Int(8))
        .Then(pt.Return(pt.Btoi(temp.load())))
        .Else(pt.Return(pt.ExtractUint64(temp.load(), pt.Int(1))))
    )


# Best case cost analysis:
# tot: twos_complement + single cost opcodes = 23 + 9 = 32
# https://github.com/imneme/pcg-c/blob/master/include/pcg_variants.h#L96
@pt.Subroutine(pt.TealType.uint64)
def __prng_rotation_64(value, rot) -> pt.Expr:
    # L104
    return pt.Seq(
        pt.Return(pt.BitwiseOr(
            pt.ShiftRight(
                value,
                rot
            ),
            pt.ShiftLeft(
                value,
                pt.BitwiseAnd(
                    __twos_complement(rot),
                    pt.Int(63)
                )
            )
        ))
    )


# Best case cost analysis:
# tot: rotation + single cost opcodes = 32 + 18 = 50
# https://github.com/imneme/pcg-c/blob/master/include/pcg_variants.h#L243
@pt.Subroutine(pt.TealType.uint64)
def __prng_rotation() -> pt.Expr:
    # L245
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
