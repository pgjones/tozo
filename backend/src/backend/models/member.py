from dataclasses import dataclass
from datetime import datetime

from quart_db import Connection


@dataclass
class Member:
    id: int
    email: str
    password_hash: str
    created: datetime
    email_verified: datetime | None
    last_totp: str | None
    totp_secret: str | None


async def select_member_by_email(db: Connection, email: str) -> Member | None:
    result = await db.fetch_one(
        """SELECT id, email, password_hash, created, email_verified, last_totp,
                  totp_secret
             FROM members
            WHERE LOWER(email) = LOWER(:email)""",
        {"email": email},
    )
    return None if result is None else Member(**result)


async def select_member_by_id(db: Connection, id: int) -> Member | None:
    result = await db.fetch_one(
        """SELECT id, email, password_hash, created, email_verified, last_totp,
                  totp_secret
             FROM members
            WHERE id = :id""",
        {"id": id},
    )
    return None if result is None else Member(**result)


async def insert_member(db: Connection, email: str, password_hash: str) -> Member:
    result = await db.fetch_one(
        """INSERT INTO members (email, password_hash)
                VALUES (:email, :password_hash)
             RETURNING id, email, password_hash, created,
                       email_verified, last_totp, totp_secret""",
        {"email": email, "password_hash": password_hash},
    )
    return Member(**result)


async def update_member_password(db: Connection, id: int, password_hash: str) -> None:
    await db.execute(
        """UPDATE members
              SET password_hash = :password_hash
            WHERE id = :id""",
        {"id": id, "password_hash": password_hash},
    )


async def update_member_email_verified(db: Connection, id: int) -> None:
    await db.execute(
        "UPDATE members SET email_verified = now() WHERE id = :id",
        {"id": id},
    )


async def update_totp_secret(db: Connection, id: int, totp_secret: str | None) -> None:
    await db.execute(
        """UPDATE members
              SET totp_secret = :totp_secret
            WHERE id = :id""",
        {"id": id, "totp_secret": totp_secret},
    )


async def update_last_totp(db: Connection, id: int, last_totp: str | None) -> None:
    await db.execute(
        """UPDATE members
              SET last_totp = :last_totp
            WHERE id = :id""",
        {"id": id, "last_totp": last_totp},
    )
