from fastapi import HTTPException, Security, WebSocketException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

_bearer = HTTPBearer()


def require_token(
    credentials: HTTPAuthorizationCredentials = Security(_bearer),
) -> None:
    """FastAPI dependency — raises 401 if the Bearer token is wrong or missing."""
    if credentials.credentials != settings.api_token:
        raise HTTPException(status_code=401, detail="Invalid or missing token")


def require_ws_token(token: str | None) -> None:
    """Called at the top of a WebSocket handler — rejects with 1008 if token invalid."""
    if token != settings.api_token:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid or missing token")
