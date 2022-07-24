from quart import Quart


async def test_session_flow(app: Quart) -> None:
    test_client = app.test_client()
    await test_client.post(
        "/sessions/",
        json={"email": "member@tozo.dev", "password": "password"},
    )
    response = await test_client.get("/sessions/")
    assert (await response.get_json())["memberId"] == 1
    await test_client.delete("/sessions/")
    response = await test_client.get("/sessions/")
    assert response.status_code == 401


async def test_login_invalid_password(app: Quart) -> None:
    test_client = app.test_client()
    await test_client.post(
        "/sessions/",
        json={"email": "member@tozo.dev", "password": "incorrect"},
    )
    response = await test_client.get("/sessions/")
    assert response.status_code == 401
