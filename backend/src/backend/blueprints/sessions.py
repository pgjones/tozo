from dataclasses import dataclass
from datetime import timedelta

import bcrypt
from pydantic import EmailStr
from pyotp.totp import TOTP
from quart import Blueprint, ResponseReturnValue, g
from quart_auth import AuthUser, current_user, login_required, login_user, logout_user
from quart_rate_limiter import rate_exempt, rate_limit
from quart_schema import validate_request, validate_response

from backend.lib.api_error import APIError
from backend.models.member import select_member_by_email, update_last_totp

blueprint = Blueprint("sessions", __name__)

REFERENCE_HASH = "$2b$12$A.BRD7hCbGciBiqNRTqxZ.odBxGo.XmRmgN4u9Jq7VUkW9xRmPxK."


@dataclass
class LoginData:
    email: EmailStr
    password: str
    remember: bool = False
    token: str | None = None


@blueprint.post("/sessions/")
@rate_limit(5, timedelta(minutes=1))
@validate_request(LoginData)
async def login(data: LoginData) -> ResponseReturnValue:
    member = await select_member_by_email(g.connection, data.email)
    password_hash = REFERENCE_HASH
    if member is not None:
        password_hash = member.password_hash

    passwords_match = bcrypt.checkpw(
        data.password.encode("utf-8"),
        password_hash.encode("utf-8"),
    )
    if passwords_match:
        assert member is not None  # nosec
        if member.totp_secret is not None and member.last_totp is not None:
            if data.token is None:
                raise APIError(400, "TOKEN_REQUIRED")

            totp = TOTP(member.totp_secret)
            if not totp.verify(data.token) or data.token == member.last_totp:
                raise APIError(401, "INVALID_CREDENTIALS")

            await update_last_totp(g.connection, member.id, data.token)

        login_user(AuthUser(str(member.id)), data.remember)
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
