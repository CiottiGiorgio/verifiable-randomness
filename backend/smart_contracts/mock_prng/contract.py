from typing import Literal

import beaker
import pyteal as pt
from algokit_utils import DELETABLE_TEMPLATE_NAME, UPDATABLE_TEMPLATE_NAME

from smart_contracts.pcg_xsl_rr_128_64.lib import prng_init, prng_randint

app = beaker.Application("mock_prng")


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
    initstate: pt.abi.StaticBytes[Literal[16]],
    initseq: pt.abi.StaticBytes[Literal[16]],
    length: pt.abi.Uint16,
    *,
    output: pt.abi.DynamicArray[pt.abi.Uint64]
) -> pt.Expr:
    opup = pt.OpUp(pt.OpUpMode.OnCall)

    i = pt.ScratchVar(pt.TealType.uint64)
    result = pt.ScratchVar(pt.TealType.bytes)

    return pt.Seq(
        opup.maximize_budget(pt.Int(30_000)),

        prng_init(initstate.get(), initseq.get()),

        pt.For(
            pt.Seq(
                i.store(pt.Int(0)),
                result.store(pt.Bytes(b""))
            ),
            i.load() < length.get(),
            i.store(i.load() + pt.Int(1))
        ).Do(
            result.store(pt.Concat(result.load(), pt.Itob(prng_randint())))
        ),

        output.decode(pt.Concat(length.encode(), result.load()))
    )
