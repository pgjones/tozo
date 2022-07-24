import pytest
from quart_db import Connection

from backend.models.todo import delete_todo, insert_todo, select_todo, update_todo


@pytest.mark.parametrize(
    "member_id, deleted",
    [(1, True), (2, False)],
)
async def test_delete_todo(
    connection: Connection, member_id: int, deleted: bool
) -> None:
    todo = await insert_todo(connection, 1, "Task", False, None)
    await delete_todo(connection, todo.id, member_id)
    new_todo = await select_todo(connection, todo.id, 1)
    assert (new_todo is None) is deleted


@pytest.mark.parametrize(
    "member_id, complete",
    [(1, True), (2, False)],
)
async def test_update_todo(
    connection: Connection, member_id: int, complete: bool
) -> None:
    todo = await insert_todo(connection, 1, "Task", False, None)
    await update_todo(connection, todo.id, member_id, "Task", True, None)
    new_todo = await select_todo(connection, todo.id, 1)
    assert new_todo is not None
    assert new_todo.complete is complete
