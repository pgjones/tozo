from quart import Blueprint, ResponseReturnValue

blueprint = Blueprint("control", __name__)


@blueprint.get("/control/ping/")
async def ping() -> ResponseReturnValue:
    return {"ping": "pong"}
