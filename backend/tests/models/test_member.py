import pytest
from asyncpg.exceptions import UniqueViolationError  # type: ignore
from quart_db import Connection

from backend.models.member import insert_member, select_member_by_email


async def test_insert_member(connection: Connection) -> None:
    await insert_member(connection, "casing@tozo.dev", "")
    with pytest.raises(UniqueViolationError):
        await insert_member(connection, "Casing@tozo.dev", "")


async def test_select_member_by_email(connection: Connection) -> None:
    await insert_member(connection, "casing@tozo.dev", "")
    member = await select_member_by_email(connection, "Casing@tozo.dev")
    assert member is not None
