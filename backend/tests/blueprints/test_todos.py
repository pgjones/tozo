from quart import Quart


async def test_post_todo(app: Quart) -> None:
    test_client = app.test_client()
    async with test_client.authenticated("1"):  # type: ignore
        response = await test_client.post(
            "/todos/",
            json={"complete": False, "due": None, "task": "Test task"},
        )
        assert response.status_code == 201
        assert (await response.get_json())["id"] > 0


async def test_get_todo(app: Quart) -> None:
    test_client = app.test_client()
    async with test_client.authenticated("1"):  # type: ignore
        response = await test_client.get("/todos/1/")
        assert response.status_code == 200
        assert (await response.get_json())["task"] == "Test Task"


async def test_put_todo(app: Quart) -> None:
    test_client = app.test_client()
    async with test_client.authenticated("1"):  # type: ignore
        response = await test_client.post(
            "/todos/",
            json={"complete": False, "due": None, "task": "Test task"},
        )
        todo_id = (await response.get_json())["id"]

        response = await test_client.put(
            f"/todos/{todo_id}/",
            json={"complete": False, "due": None, "task": "Updated"},
        )
        assert (await response.get_json())["task"] == "Updated"

        response = await test_client.get(f"/todos/{todo_id}/")
        assert (await response.get_json())["task"] == "Updated"


async def test_delete_todo(app: Quart) -> None:
    test_client = app.test_client()
    async with test_client.authenticated("1"):  # type: ignore
        response = await test_client.post(
            "/todos/",
            json={"complete": False, "due": None, "task": "Test task"},
        )
        todo_id = (await response.get_json())["id"]

        await test_client.delete(f"/todos/{todo_id}/")

        response = await test_client.get(f"/todos/{todo_id}/")
        assert response.status_code == 404
