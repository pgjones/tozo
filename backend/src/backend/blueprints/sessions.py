from dataclasses import dataclass
from datetime import timedelta

import bcrypt
from pydantic import EmailStr
from quart import Blueprint, ResponseReturnValue, g
from quart_auth import AuthUser, current_user, login_required, login_user, logout_user
from quart_rate_limiter import rate_exempt, rate_limit
from quart_schema import validate_request, validate_response

from backend.lib.api_error import APIError
from backend.models.member import select_member_by_email

blueprint = Blueprint("sessions", __name__)


@dataclass
class LoginData:
    email: EmailStr
    password: str
    remember: bool = False


@blueprint.post("/sessions/")
@rate_limit(5, timedelta(minutes=1))
@validate_request(LoginData)
async def login(data: LoginData) -> ResponseReturnValue:
    """Login to the app.

    By providing credentials and then saving the returned cookie.
    """
    result = await select_member_by_email(g.connection, data.email)
    if result is None:
        raise APIError(401, "INVALID_CREDENTIALS")

    passwords_match = bcrypt.checkpw(
        data.password.encode("utf-8"),
        result.password_hash.encode("utf-8"),
    )
    if passwords_match:
        login_user(AuthUser(str(result.id)), data.remember)
        return {}, 200
    else:
        raise APIError(401, "INVALID_CREDENTIALS")


@blueprint.delete("/sessions/")
@rate_exempt
async def logout() -> ResponseReturnValue:
    """Logout from the app.

    Deletes the session cookie.
    """
    logout_user()
    return {}


@dataclass
class Status:
    member_id: int


@blueprint.get("/sessions/")
@rate_limit(10, timedelta(minutes=1))
@login_required
@validate_response(Status)
async def status() -> ResponseReturnValue:
    assert current_user.auth_id is not None  # nosec
    return Status(member_id=int(current_user.auth_id))
