from dataclasses import dataclass
from datetime import timedelta
from typing import cast

import asyncpg  # type: ignore
import bcrypt
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from pydantic import EmailStr
from quart import Blueprint, ResponseReturnValue, current_app, g
from quart_auth import current_user, login_required
from quart_rate_limiter import rate_limit
from quart_schema import validate_request
from zxcvbn import zxcvbn  # type: ignore

from backend.lib.api_error import APIError
from backend.lib.email import send_email
from backend.models.member import (
    insert_member,
    select_member_by_email,
    select_member_by_id,
    update_member_email_verified,
    update_member_password,
)

blueprint = Blueprint("members", __name__)

MINIMUM_STRENGTH = 3
EMAIL_VERIFICATION_SALT = "email verify"
ONE_MONTH = int(timedelta(days=30).total_seconds())
FORGOTTEN_PASSWORD_SALT = "forgotten password"  # nosec
ONE_DAY = int(timedelta(hours=24).total_seconds())


@dataclass
class MemberData:
    email: str
    password: str


@blueprint.post("/members/")
@rate_limit(10, timedelta(seconds=10))
@validate_request(MemberData)
async def register(data: MemberData) -> ResponseReturnValue:
    """Create a new Member.

    This allows a Member to be created.
    """
    strength = zxcvbn(data.password)
    if strength["score"] < MINIMUM_STRENGTH:
        raise APIError(400, "WEAK_PASSWORD")

    hashed_password = bcrypt.hashpw(
        data.password.encode("utf-8"),
        bcrypt.gensalt(14),
    )
    try:
        member = await insert_member(
            g.connection,
            data.email,
            hashed_password.decode(),
        )
    except asyncpg.exceptions.UniqueViolationError:
        pass
    else:
        serializer = URLSafeTimedSerializer(
            current_app.secret_key, salt=EMAIL_VERIFICATION_SALT
        )
        token = serializer.dumps(member.id)
        await send_email(
            member.email,
            "Welcome",
            "welcome.html",
            {"token": token},
        )

    return {}, 201


@dataclass
class TokenData:
    token: str


@blueprint.put("/members/email/")
@rate_limit(5, timedelta(minutes=1))
@validate_request(TokenData)
async def verify_email(data: TokenData) -> ResponseReturnValue:
    """Call to verify an email.

    This requires the user to supply a valid token.
    """
    serializer = URLSafeTimedSerializer(
        current_app.secret_key, salt=EMAIL_VERIFICATION_SALT
    )
    try:
        member_id = serializer.loads(data.token, max_age=ONE_MONTH)
    except SignatureExpired:
        raise APIError(403, "TOKEN_EXPIRED")
    except BadSignature:
        raise APIError(400, "TOKEN_INVALID")
    else:
        await update_member_email_verified(g.connection, member_id)
    return {}


@dataclass
class PasswordData:
    current_password: str
    new_password: str


@blueprint.put("/members/password/")
@rate_limit(5, timedelta(minutes=1))
@login_required
@validate_request(PasswordData)
async def change_password(data: PasswordData) -> ResponseReturnValue:
    """Update the members password.

    This allows the user to update their password.
    """
    strength = zxcvbn(data.new_password)
    if strength["score"] < MINIMUM_STRENGTH:
        raise APIError(400, "WEAK_PASSWORD")

    member_id = int(cast(str, current_user.auth_id))
    member = await select_member_by_id(g.connection, member_id)
    assert member is not None  # nosec
    passwords_match = bcrypt.checkpw(
        data.current_password.encode("utf-8"),
        member.password_hash.encode("utf-8"),
    )
    if not passwords_match:
        raise APIError(401, "INVALID_PASSWORD")

    hashed_password = bcrypt.hashpw(
        data.new_password.encode("utf-8"),
        bcrypt.gensalt(14),
    )
    await update_member_password(g.connection, member_id, hashed_password.decode())
    await send_email(
        member.email,
        "Password changed",
        "password_changed.html",
        {},
    )
    return {}


@dataclass
class ForgottenPasswordData:
    email: EmailStr


@blueprint.put("/members/forgotten-password/")
@rate_limit(5, timedelta(minutes=1))
@validate_request(ForgottenPasswordData)
async def forgotten_password(data: ForgottenPasswordData) -> ResponseReturnValue:
    """Call to trigger a forgotten password email.

    This requires a valid member email.
    """
    member = await select_member_by_email(g.connection, data.email)
    if member is not None:
        serializer = URLSafeTimedSerializer(
            current_app.secret_key, salt=FORGOTTEN_PASSWORD_SALT
        )
        token = serializer.dumps(member.id)
        await send_email(
            member.email,
            "Forgotten password",
            "forgotten_password.html",
            {"token": token},
        )
    return {}


@dataclass
class ResetPasswordData:
    password: str
    token: str


@blueprint.put("/members/reset-password/")
@rate_limit(5, timedelta(minutes=1))
@validate_request(ResetPasswordData)
async def reset_password(data: ResetPasswordData) -> ResponseReturnValue:
    """Call to reset a password using a token.

    This requires the user to supply a valid token and a
    new password.
    """
    serializer = URLSafeTimedSerializer(
        current_app.secret_key, salt=FORGOTTEN_PASSWORD_SALT
    )
    try:
        member_id = serializer.loads(data.token, max_age=ONE_DAY)
    except SignatureExpired:
        raise APIError(403, "TOKEN_EXPIRED")
    except BadSignature:
        raise APIError(400, "TOKEN_INVALID")
    else:
        strength = zxcvbn(data.password)
        if strength["score"] < MINIMUM_STRENGTH:
            raise APIError(400, "WEAK_PASSWORD")

        hashed_password = bcrypt.hashpw(
            data.password.encode("utf-8"),
            bcrypt.gensalt(14),
        )
        await update_member_password(g.connection, member_id, hashed_password.decode())
        member = await select_member_by_id(
            g.connection, int(cast(str, current_user.auth_id))
        )
        assert member is not None  # nosec
        await send_email(
            member.email,
            "Password changed",
            "password_changed.html",
            {},
        )
    return {}
