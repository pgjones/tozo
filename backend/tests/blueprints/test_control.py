from backend.run import app


async def test_control() -> None:
    test_client = app.test_client()
    response = await test_client.get("/control/ping/")
    assert (await response.get_json())["ping"] == "pong"
