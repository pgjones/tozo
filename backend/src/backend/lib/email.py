import logging
from typing import Any, cast

import httpx
from quart import current_app, render_template

log = logging.getLogger(__name__)


class PostmarkError(Exception):
    def __init__(self, error_code: int, message: str) -> None:
        self.error_code = error_code
        self.message = message


async def send_email(
    to: str,
    subject: str,
    template: str,
    ctx: dict[str, Any],
) -> None:
    content = await render_template(template, **ctx)
    log.info("Sending %s to %s\n%s", template, to, content)
    token = current_app.config.get("POSTMARK_TOKEN")
    if token is not None:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.postmarkapp.com/email",
                json={
                    "From": "Tozo <help@tozo.dev>",
                    "To": to,
                    "Subject": subject,
                    "Tag": template,
                    "HtmlBody": content,
                },
                headers={"X-Postmark-Server-Token": token},
            )
        data = cast(dict, response.json())
        if response.status_code != 200:
            raise PostmarkError(data["ErrorCode"], data["Message"])
