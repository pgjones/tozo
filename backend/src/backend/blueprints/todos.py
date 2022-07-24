from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import cast

from quart import Blueprint, ResponseReturnValue, g
from quart_auth import current_user, login_required
from quart_rate_limiter import rate_limit
from quart_schema import validate_querystring, validate_request, validate_response

from backend.lib.api_error import APIError
from backend.models.todo import (
    Todo,
    delete_todo,
    insert_todo,
    select_todo,
    select_todos,
    update_todo,
)

blueprint = Blueprint("todos", __name__)


@dataclass
class TodoData:
    complete: bool
    due: datetime | None
    task: str


@blueprint.post("/todos/")
@rate_limit(10, timedelta(seconds=10))
@login_required
@validate_request(TodoData)
@validate_response(Todo, 201)
async def post_todo(data: TodoData) -> tuple[Todo, int]:
    """Create a new Todo.

    This allows todos to be created and stored.
    """
    todo = await insert_todo(
        g.connection,
        int(cast(str, current_user.auth_id)),
        data.task,
        data.complete,
        data.due,
    )
    return todo, 201


@blueprint.get("/todos/<int:id>/")
@rate_limit(10, timedelta(seconds=10))
@login_required
@validate_response(Todo)
async def get_todo(id: int) -> Todo:
    """Get a todo.

    Fetch a Todo by its ID.
    """
    todo = await select_todo(g.connection, id, int(cast(str, current_user.auth_id)))
    if todo is None:
        raise APIError(404, "NOT_FOUND")
    else:
        return todo


@dataclass
class Todos:
    todos: list[Todo]


@dataclass
class TodoFilter:
    complete: bool | None = None


@blueprint.get("/todos/")
@rate_limit(10, timedelta(seconds=10))
@login_required
@validate_response(Todos)
@validate_querystring(TodoFilter)
async def get_todos(query_args: TodoFilter) -> Todos:
    """Get the todos.

    Fetch all the Todos optionally based on the complete status.
    """
    todos = await select_todos(
        g.connection,
        int(cast(str, current_user.auth_id)),
        query_args.complete,
    )
    return Todos(todos=todos)


@blueprint.put("/todos/<int:id>/")
@rate_limit(10, timedelta(seconds=10))
@login_required
@validate_request(TodoData)
@validate_response(Todo)
async def put_todo(id: int, data: TodoData) -> Todo:
    """Update the identified todo

    This allows the todo to be replaced with the request data.
    """
    todo = await update_todo(
        g.connection,
        id,
        int(cast(str, current_user.auth_id)),
        data.task,
        data.complete,
        data.due,
    )
    if todo is None:
        raise APIError(404, "NOT_FOUND")
    else:
        return todo


@blueprint.delete("/todos/<int:id>/")
@rate_limit(10, timedelta(seconds=10))
@login_required
async def todo_delete(id: int) -> ResponseReturnValue:
    """Delete the identified todo

    This will delete the todo.
    """
    await delete_todo(g.connection, id, int(cast(str, current_user.auth_id)))
    return "", 202
