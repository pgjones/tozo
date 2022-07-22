from quart import Blueprint, ResponseReturnValue
from quart_rate_limiter import rate_exempt

blueprint = Blueprint("control", __name__)


@blueprint.get("/control/ping/")
@rate_exempt
async def ping() -> ResponseReturnValue:
    return {"ping": "pong"}
