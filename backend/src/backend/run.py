from quart import Quart, ResponseReturnValue
from quart_auth import AuthManager

from backend.blueprints.control import blueprint as control_blueprint
from backend.lib.api_error import APIError

app = Quart(__name__)
app.config.from_prefixed_env(prefix="TOZO")

auth_manager = AuthManager(app)

app.register_blueprint(control_blueprint)


@app.errorhandler(APIError)  # type: ignore
async def handle_api_error(error: APIError) -> ResponseReturnValue:
    return {"code": error.code}, error.status_code


@app.errorhandler(500)
async def handle_generic_error(error: Exception) -> ResponseReturnValue:
    return {"code": "INTERNAL_SERVER_ERROR"}, 500
