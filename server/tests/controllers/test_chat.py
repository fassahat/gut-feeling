import json

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.message import Message
from tests.conftest import TEST_TOKEN

WS_URL = f"/ws/{{user_id}}?token={TEST_TOKEN}"


class TestWebSocketChat:
    @pytest.mark.asyncio
    async def test_full_chat_flow(self, db: AsyncSession) -> None:
        from starlette.testclient import TestClient
        from app.main import app

        with TestClient(app) as tc:
            with tc.websocket_connect(WS_URL.format(user_id="user-test")) as ws:
                data = ws.receive_json()
                assert data["type"] == "connected"

                ws.send_text(json.dumps({"content": "hello"}))

                user_echo = ws.receive_json()
                assert user_echo["type"] == "message"
                assert user_echo["data"]["content"] == "hello"
                assert user_echo["data"]["sender"] == "user"

                typing = ws.receive_json()
                assert typing["type"] == "typing"

                bot_msg = ws.receive_json()
                assert bot_msg["type"] == "message"
                assert bot_msg["data"]["sender"] == "bot"
                assert len(bot_msg["data"]["content"]) > 0

    @pytest.mark.asyncio
    async def test_invalid_message_format(self) -> None:
        from starlette.testclient import TestClient
        from app.main import app

        with TestClient(app) as tc:
            with tc.websocket_connect(WS_URL.format(user_id="user-test")) as ws:
                ws.receive_json()  # connected event

                ws.send_text("not valid json")

                error = ws.receive_json()
                assert error["type"] == "error"
                assert "Invalid" in error["message"]

    @pytest.mark.asyncio
    async def test_messages_persisted_to_db(self, db: AsyncSession) -> None:
        from starlette.testclient import TestClient
        from app.main import app

        with TestClient(app) as tc:
            with tc.websocket_connect(WS_URL.format(user_id="user-persist")) as ws:
                ws.receive_json()  # connected

                ws.send_text(json.dumps({"content": "hi there"}))

                ws.receive_json()  # user echo
                ws.receive_json()  # typing
                ws.receive_json()  # bot response

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
            with tc.websocket_connect(WS_URL.format(user_id="user-greet")) as ws:
                ws.receive_json()  # connected

                ws.send_text(json.dumps({"content": "hello"}))

                ws.receive_json()  # user echo
                ws.receive_json()  # typing
                bot_msg = ws.receive_json()

                assert bot_msg["data"]["content"] in expected_responses

    @pytest.mark.asyncio
    async def test_content_too_long_returns_error(self) -> None:
        from starlette.testclient import TestClient
        from app.main import app

        with TestClient(app) as tc:
            with tc.websocket_connect(WS_URL.format(user_id="user-flood")) as ws:
                ws.receive_json()  # connected

                ws.send_text(json.dumps({"content": "x" * 4001}))

                error = ws.receive_json()
                assert error["type"] == "error"

    # --- Auth boundary tests ---

    @pytest.mark.asyncio
    async def test_rejected_without_token(self) -> None:
        from starlette.testclient import TestClient
        from app.main import app

        with TestClient(app) as tc:
            with pytest.raises(Exception):
                # WebSocket should be rejected with 1008 before accept()
                with tc.websocket_connect("/ws/user-notoken") as ws:
                    ws.receive_json()

    @pytest.mark.asyncio
    async def test_rejected_with_wrong_token(self) -> None:
        from starlette.testclient import TestClient
        from app.main import app

        with TestClient(app) as tc:
            with pytest.raises(Exception):
                with tc.websocket_connect("/ws/user-badtoken?token=wrong") as ws:
                    ws.receive_json()
