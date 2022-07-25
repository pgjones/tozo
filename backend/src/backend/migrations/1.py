from quart_db import Connection


async def migrate(connection: Connection) -> None:
    await connection.execute("ALTER TABLE members ADD COLUMN totp_secret TEXT")
    await connection.execute("ALTER TABLE members ADD COLUMN last_totp TEXT")


async def valid_migration(connection: Connection) -> bool:
    return True
