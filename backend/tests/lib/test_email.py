from pytest import LogCaptureFixture
from quart import Quart

from backend.lib.email import send_email


async def test_send_email(app: Quart, caplog: LogCaptureFixture) -> None:
    async with app.app_context():
        await send_email("member@tozo.dev", "Welcome", "email.html", {})
    assert "Sending email.html to member@tozo.dev" in caplog.text
