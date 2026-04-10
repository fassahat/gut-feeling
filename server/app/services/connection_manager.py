from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self._connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections[user_id] = websocket

    def disconnect(self, user_id: str) -> None:
        self._connections.pop(user_id, None)

    async def send_json(self, user_id: str, data: dict) -> None:  # type: ignore[type-arg]
        ws = self._connections.get(user_id)
        if ws is not None:
            await ws.send_json(data)

    def is_connected(self, user_id: str) -> bool:
        return user_id in self._connections


manager = ConnectionManager()
