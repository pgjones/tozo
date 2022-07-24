from quart_db import Connection


async def migrate(connection: Connection) -> None:
    await connection.execute(
        """CREATE TABLE members (
               id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
               created TIMESTAMP NOT NULL DEFAULT now(),
               email TEXT NOT NULL,
               email_verified TIMESTAMP,
               password_hash TEXT NOT NULL
           )""",
    )
    await connection.execute(
        """CREATE UNIQUE INDEX members_unique_email_idx
                            ON members (LOWER(email)
        )"""
    )
    await connection.execute(
        """CREATE TABLE todos (
               id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
               complete BOOLEAN NOT NULL DEFAULT FALSE,
               due TIMESTAMPTZ,
               member_id INT NOT NULL REFERENCES members(id),
               task TEXT NOT NULL
           )""",
    )


async def valid_migration(connection: Connection) -> bool:
    return True
