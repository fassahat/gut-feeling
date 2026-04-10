import pytest
from unittest.mock import AsyncMock, MagicMock

from app.services.connection_manager import ConnectionManager


class TestConnectionManager:
    def test_initially_not_connected(self) -> None:
        mgr = ConnectionManager()
        assert mgr.is_connected("user-1") is False

    @pytest.mark.asyncio
    async def test_connect_and_is_connected(self) -> None:
        mgr = ConnectionManager()
        ws = AsyncMock()
        await mgr.connect("user-1", ws)

        assert mgr.is_connected("user-1") is True
        ws.accept.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_disconnect(self) -> None:
        mgr = ConnectionManager()
        ws = AsyncMock()
        await mgr.connect("user-1", ws)
        mgr.disconnect("user-1")

        assert mgr.is_connected("user-1") is False

    def test_disconnect_unknown_user_no_error(self) -> None:
        mgr = ConnectionManager()
        mgr.disconnect("nonexistent")  # should not raise

    @pytest.mark.asyncio
    async def test_send_json(self) -> None:
        mgr = ConnectionManager()
        ws = AsyncMock()
        await mgr.connect("user-1", ws)

        await mgr.send_json("user-1", {"type": "test"})
        ws.send_json.assert_awaited_once_with({"type": "test"})

    @pytest.mark.asyncio
    async def test_send_json_to_disconnected_user(self) -> None:
        mgr = ConnectionManager()
        # Should not raise when user is not connected
        await mgr.send_json("nonexistent", {"type": "test"})

    @pytest.mark.asyncio
    async def test_new_connection_replaces_old(self) -> None:
        mgr = ConnectionManager()
        ws1 = AsyncMock()
        ws2 = AsyncMock()

        await mgr.connect("user-1", ws1)
        await mgr.connect("user-1", ws2)

        await mgr.send_json("user-1", {"type": "ping"})
        ws2.send_json.assert_awaited_once_with({"type": "ping"})
        ws1.send_json.assert_not_awaited()
