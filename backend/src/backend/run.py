from quart import Quart, ResponseReturnValue
from quart_auth import AuthManager
from quart_rate_limiter import RateLimiter, RateLimitExceeded

from backend.blueprints.control import blueprint as control_blueprint
from backend.lib.api_error import APIError

app = Quart(__name__)
app.config.from_prefixed_env(prefix="TOZO")

auth_manager = AuthManager(app)
rate_limiter = RateLimiter(app)

app.register_blueprint(control_blueprint)


@app.errorhandler(APIError)  # type: ignore
async def handle_api_error(error: APIError) -> ResponseReturnValue:
    return {"code": error.code}, error.status_code


@app.errorhandler(500)
async def handle_generic_error(error: Exception) -> ResponseReturnValue:
    return {"code": "INTERNAL_SERVER_ERROR"}, 500


@app.errorhandler(RateLimitExceeded)  # type: ignore
async def handle_rate_limit_exceeded_error(
    error: RateLimitExceeded,
) -> ResponseReturnValue:
    return {}, error.get_headers(), 429
