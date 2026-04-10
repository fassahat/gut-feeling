import json

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.message import Message


class TestWebSocketChat:
    @pytest.mark.asyncio
    async def test_connected_event_on_connect(self, client: AsyncClient) -> None:
        async with client.stream("GET", "/ws/user-alice") as _:
            pass
        # WebSocket tests need the real ASGI websocket interface
        # Using starlette's TestClient for WS tests instead

    @pytest.mark.asyncio
    async def test_full_chat_flow(self, db: AsyncSession) -> None:
        from starlette.testclient import TestClient
        from app.main import app

        with TestClient(app) as tc:
            with tc.websocket_connect("/ws/user-test") as ws:
                # Should receive connected event
                data = ws.receive_json()
                assert data["type"] == "connected"

                # Send a greeting message
                ws.send_text(json.dumps({
                    "content": "hello",
                    "user_id": "user-test",
                }))

                # Should receive user message echo
                user_echo = ws.receive_json()
                assert user_echo["type"] == "message"
                assert user_echo["data"]["content"] == "hello"
                assert user_echo["data"]["sender"] == "user"

                # Should receive typing indicator
                typing = ws.receive_json()
                assert typing["type"] == "typing"

                # Should receive bot response
                bot_msg = ws.receive_json()
                assert bot_msg["type"] == "message"
                assert bot_msg["data"]["sender"] == "bot"
                assert len(bot_msg["data"]["content"]) > 0

    @pytest.mark.asyncio
    async def test_invalid_message_format(self) -> None:
        from starlette.testclient import TestClient
        from app.main import app

        with TestClient(app) as tc:
            with tc.websocket_connect("/ws/user-test") as ws:
                ws.receive_json()  # connected event

                # Send invalid JSON
                ws.send_text("not valid json")

                error = ws.receive_json()
                assert error["type"] == "error"
                assert "Invalid" in error["message"]

    @pytest.mark.asyncio
    async def test_messages_persisted_to_db(self, db: AsyncSession) -> None:
        from starlette.testclient import TestClient
        from app.main import app

        with TestClient(app) as tc:
            with tc.websocket_connect("/ws/user-persist") as ws:
                ws.receive_json()  # connected

                ws.send_text(json.dumps({
                    "content": "hi there",
                    "user_id": "user-persist",
                }))

                ws.receive_json()  # user echo
                ws.receive_json()  # typing
                ws.receive_json()  # bot response

        # Check DB has both user and bot messages
        result = await db.execute(
            select(Message).where(Message.user_id == "user-persist")
        )
        messages = list(result.scalars().all())
        assert len(messages) == 2
        senders = {m.sender for m in messages}
        assert senders == {"user", "bot"}

    @pytest.mark.asyncio
    async def test_greeting_gets_bubbles_response(self) -> None:
        from starlette.testclient import TestClient
        from app.main import app
        from app.services.chatbot import KEYWORD_RESPONSES

        greeting_key = ("hello", "hi", "hey", "morning", "evening", "good day", "howdy")
        expected_responses = KEYWORD_RESPONSES[greeting_key]

        with TestClient(app) as tc:
            with tc.websocket_connect("/ws/user-greet") as ws:
                ws.receive_json()  # connected

                ws.send_text(json.dumps({
                    "content": "hello",
                    "user_id": "user-greet",
                }))

                ws.receive_json()  # user echo
                ws.receive_json()  # typing
                bot_msg = ws.receive_json()

                assert bot_msg["data"]["content"] in expected_responses
