from quart_db import Connection


async def execute(connection: Connection) -> None:
    await connection.execute(
        """INSERT INTO members (email, password_hash)
                VALUES ('member@tozo.dev',
                        '$2b$14$6yXjNza30kPCg3LhzZJfqeCWOLM.zyTiQFD4rdWlFHBTfYzzKJMJe'
           )"""
    )
    await connection.execute(
        """INSERT INTO todos (member_id, task)
                VALUES (1, 'Test Task')"""
    )
