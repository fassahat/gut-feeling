import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.message import Message


class TestGetMessages:
    @pytest.mark.asyncio
    async def test_returns_empty_list_for_new_user(
        self, client: AsyncClient
    ) -> None:
        response = await client.get("/api/messages", params={"user_id": "user-new"})
        assert response.status_code == 200
        assert response.json() == []

    @pytest.mark.asyncio
    async def test_returns_messages_for_user(
        self, client: AsyncClient, db: AsyncSession
    ) -> None:
        msg = Message(user_id="user-alice", content="hello", sender="user")
        db.add(msg)
        await db.commit()

        response = await client.get(
            "/api/messages", params={"user_id": "user-alice"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["content"] == "hello"
        assert data[0]["sender"] == "user"
        assert data[0]["user_id"] == "user-alice"

    @pytest.mark.asyncio
    async def test_messages_ordered_by_created_at(
        self, client: AsyncClient, db: AsyncSession
    ) -> None:
        msg1 = Message(user_id="user-alice", content="first", sender="user")
        msg2 = Message(user_id="user-alice", content="second", sender="bot")
        db.add(msg1)
        await db.flush()
        db.add(msg2)
        await db.commit()

        response = await client.get(
            "/api/messages", params={"user_id": "user-alice"}
        )
        data = response.json()
        assert len(data) == 2
        assert data[0]["content"] == "first"
        assert data[1]["content"] == "second"

    @pytest.mark.asyncio
    async def test_filters_by_user_id(
        self, client: AsyncClient, db: AsyncSession
    ) -> None:
        db.add(Message(user_id="user-alice", content="alice msg", sender="user"))
        db.add(Message(user_id="user-bob", content="bob msg", sender="user"))
        await db.commit()

        response = await client.get(
            "/api/messages", params={"user_id": "user-alice"}
        )
        data = response.json()
        assert len(data) == 1
        assert data[0]["content"] == "alice msg"

    @pytest.mark.asyncio
    async def test_missing_user_id_returns_422(
        self, client: AsyncClient
    ) -> None:
        response = await client.get("/api/messages")
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_empty_user_id_returns_422(
        self, client: AsyncClient
    ) -> None:
        response = await client.get("/api/messages", params={"user_id": ""})
        assert response.status_code == 422
