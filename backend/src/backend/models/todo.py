from dataclasses import dataclass
from datetime import datetime

from pydantic import constr
from quart_db import Connection


@dataclass
class Todo:
    complete: bool
    due: datetime | None
    id: int
    task: constr(strip_whitespace=True, min_length=1)  # type: ignore


async def select_todos(
    connection: Connection,
    member_id: int,
    complete: bool | None = None,
) -> list[Todo]:
    if complete is None:
        query = """SELECT id, complete, due, task
                     FROM todos
                    WHERE member_id = :member_id"""
        values = {"member_id": member_id}
    else:
        query = """SELECT id, complete, due, task
                     FROM todos
                    WHERE member_id = :member_id
                          AND complete = :complete"""
        values = {"member_id": member_id, "complete": complete}
    return [Todo(**row) async for row in connection.iterate(query, values)]


async def select_todo(
    connection: Connection,
    id: int,
    member_id: int,
) -> Todo | None:
    result = await connection.fetch_one(
        """SELECT id, complete, due, task
             FROM todos
            WHERE id = :id AND member_id = :member_id""",
        {"id": id, "member_id": member_id},
    )
    return None if result is None else Todo(**result)


async def insert_todo(
    connection: Connection,
    member_id: int,
    task: str,
    complete: bool,
    due: datetime | None,
) -> Todo:
    result = await connection.fetch_one(
        """INSERT INTO todos (complete, due, member_id, task)
                VALUES (:complete, :due, :member_id, :task)
             RETURNING id, complete, due, task""",
        {
            "member_id": member_id,
            "task": task,
            "complete": complete,
            "due": due,
        },
    )
    return Todo(**result)


async def update_todo(
    connection: Connection,
    id: int,
    member_id: int,
    task: str,
    complete: bool,
    due: datetime | None,
) -> Todo | None:
    result = await connection.fetch_one(
        """UPDATE todos
              SET complete = :complete, due = :due, task = :task
            WHERE id = :id AND member_id = :member_id
        RETURNING id, complete, due, task""",
        {
            "id": id,
            "member_id": member_id,
            "task": task,
            "complete": complete,
            "due": due,
        },
    )
    return None if result is None else Todo(**result)


async def delete_todo(
    connection: Connection,
    id: int,
    member_id: int,
) -> None:
    await connection.execute(
        "DELETE FROM todos WHERE id = :id AND member_id = :member_id",
        {"id": id, "member_id": member_id},
    )
