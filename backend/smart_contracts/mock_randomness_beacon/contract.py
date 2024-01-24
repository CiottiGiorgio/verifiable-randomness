import beaker
import pyteal as pt
from algokit_utils import DELETABLE_TEMPLATE_NAME, UPDATABLE_TEMPLATE_NAME

app = beaker.Application("mock_randomness_beacon")


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
def must_get(
    block: pt.abi.Uint64, user_data: pt.abi.DynamicBytes, *, output: pt.abi.DynamicBytes
) -> pt.Expr:
    return output.set(pt.Tmpl.Bytes("TMPL_MOCK_VRF_OUTPUT"))
