import logging
import os
from subprocess import call  # nosec
from urllib.parse import urlparse

from quart import Quart, Response, ResponseReturnValue
from quart_auth import AuthManager
from quart_db import QuartDB
from quart_rate_limiter import RateLimiter, RateLimitExceeded
from quart_schema import QuartSchema, RequestSchemaValidationError
from werkzeug.http import COOP

from backend.blueprints.control import blueprint as control_blueprint
from backend.blueprints.members import blueprint as members_blueprint
from backend.blueprints.serving import blueprint as serving_blueprint
from backend.blueprints.sessions import blueprint as sessions_blueprint
from backend.blueprints.todos import blueprint as todos_blueprint
from backend.lib.api_error import APIError

logging.basicConfig(level=logging.INFO)

app = Quart(__name__)
app.config.from_prefixed_env(prefix="TOZO")

auth_manager = AuthManager(app)
quart_db = QuartDB(app)
rate_limiter = RateLimiter(app)
schema = QuartSchema(app, convert_casing=True)

app.register_blueprint(control_blueprint)
app.register_blueprint(members_blueprint)
app.register_blueprint(serving_blueprint)
app.register_blueprint(sessions_blueprint)
app.register_blueprint(todos_blueprint)


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


@app.errorhandler(RequestSchemaValidationError)  # type: ignore
async def handle_request_validation_error(
    error: RequestSchemaValidationError,
) -> ResponseReturnValue:
    if isinstance(error.validation_error, TypeError):
        return {"errors": str(error.validation_error)}, 400
    else:
        return {"errors": error.validation_error.json()}, 400


@app.cli.command("recreate_db")
def recreate_db() -> None:
    db_url = urlparse(os.environ["TOZO_QUART_DB_DATABASE_URL"])
    call(  # nosec
        [
            "psql",
            "-U",
            "postgres",
            "-c",
            f"DROP DATABASE IF EXISTS {db_url.path.removeprefix('/')}",
        ],
    )
    call(  # nosec
        ["psql", "-U", "postgres", "-c", f"DROP USER IF EXISTS {db_url.username}"],
    )
    call(  # nosec
        [
            "psql",
            "-U",
            "postgres",
            "-c",
            f"CREATE USER {db_url.username} LOGIN PASSWORD '{db_url.password}' CREATEDB",  # noqa: E501
        ],
    )
    call(  # nosec
        [
            "psql",
            "-U",
            "postgres",
            "-c",
            f"CREATE DATABASE {db_url.path.removeprefix('/')}",
        ],
    )


@app.after_request
async def add_headers(response: Response) -> Response:
    response.content_security_policy.default_src = "'self'"
    response.content_security_policy.connect_src = "'self' *.sentry.io"
    response.content_security_policy.frame_ancestors = "'none'"
    response.content_security_policy.style_src = "'self' 'unsafe-inline'"
    response.cross_origin_opener_policy = COOP.SAME_ORIGIN
    response.headers["Referrer-Policy"] = "no-referrer, strict-origin-when-cross-origin"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers[
        "Strict-Transport-Security"
    ] = "max-age=63072000; includeSubDomains; preload"
    return response
