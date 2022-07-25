from quart import (
    Blueprint,
    ResponseReturnValue,
    current_app,
    render_template,
    send_from_directory,
)
from quart_rate_limiter import rate_exempt

blueprint = Blueprint("serving", __name__)


@blueprint.get("/")
@blueprint.get("/<path:path>")
@rate_exempt
async def index(path: str | None = None) -> ResponseReturnValue:
    return await render_template("index.html")


@blueprint.get(
    "/<any('service-worker.js', 'service-worker.js.map', 'manifest.json', 'asset-manifest.json', 'favicon.svg', 'logo192.png', 'logo512.png'):path>"  # noqa: E501
)
@rate_exempt
async def resources(path: str) -> ResponseReturnValue:
    assert current_app.static_folder is not None  # nosec
    return await send_from_directory(current_app.static_folder, path)
