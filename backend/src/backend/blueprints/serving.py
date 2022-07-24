from quart import Blueprint, ResponseReturnValue, render_template
from quart_rate_limiter import rate_exempt

blueprint = Blueprint("serving", __name__)


@blueprint.get("/")
@blueprint.get("/<path:path>")
@rate_exempt
async def index(path: str | None = None) -> ResponseReturnValue:
    return await render_template("index.html")
