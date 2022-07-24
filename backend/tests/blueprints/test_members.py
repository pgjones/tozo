import pytest
from freezegun import freeze_time
from itsdangerous import URLSafeTimedSerializer
from quart import Quart

from backend.blueprints.members import EMAIL_VERIFICATION_SALT


async def test_register(app: Quart, caplog: pytest.LogCaptureFixture) -> None:
    test_client = app.test_client()
    data = {
        "email": "new@tozo.dev",
        "password": "testPassword2$",
    }
    await test_client.post("/members/", json=data)
    response = await test_client.post("/sessions/", json=data)
    assert response.status_code == 200
    assert "Sending welcome.html to new@tozo.dev" in caplog.text


@pytest.mark.parametrize(
    "time, expected",
    [("2022-01-01", 403), (None, 200)],
)
async def test_verify_email(app: Quart, time: str | None, expected: int) -> None:
    with freeze_time(time):
        signer = URLSafeTimedSerializer(app.secret_key, salt=EMAIL_VERIFICATION_SALT)
        token = signer.dumps(1)
    test_client = app.test_client()
    response = await test_client.put("/members/email/", json={"token": token})
    assert response.status_code == expected


async def test_verify_email_invalid_token(app: Quart) -> None:
    test_client = app.test_client()
    response = await test_client.put("/members/email/", json={"token": "invalid"})
    assert response.status_code == 400


async def test_change_password(app: Quart, caplog: pytest.LogCaptureFixture) -> None:
    test_client = app.test_client()
    data = {
        "email": "new_password@tozo.dev",
        "password": "testPassword2$",
    }
    response = await test_client.post("/members/", json=data)
    async with test_client.authenticated("2"):  # type: ignore
        response = await test_client.put(
            "/members/password/",
            json={
                "currentPassword": data["password"],
                "newPassword": "testPassword3$",
            },
        )
        assert response.status_code == 200
    assert "Sending password_changed.html to new@tozo.dev" in caplog.text


async def test_forgotten_password(app: Quart, caplog: pytest.LogCaptureFixture) -> None:
    test_client = app.test_client()
    data = {"email": "member@tozo.dev"}
    response = await test_client.put("/members/forgotten-password/", json=data)
    assert response.status_code == 200
    assert "Sending forgotten_password.html to member@tozo.dev" in caplog.text
