import asyncio
import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import DbDep
from app.services.auth import require_ws_token
from app.models.message import Message
from app.schemas.message import MessageOut, WebSocketMessageIn
from app.services.chatbot import generate_response
from app.services.connection_manager import manager

logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])


async def _persist_message(
    db: AsyncSession, user_id: str, content: str, sender: str
) -> Message:
    msg = Message(user_id=user_id, content=content, sender=sender)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg


@router.websocket("/ws/{user_id}")
async def websocket_chat(
    websocket: WebSocket,
    user_id: str,
    db: DbDep,
    token: str | None = None,
) -> None:
    require_ws_token(token)
    await manager.connect(user_id, websocket)
    await manager.send_json(user_id, {"type": "connected"})

    try:
        while True:
            raw = await websocket.receive_text()

            try:
                data = WebSocketMessageIn.model_validate_json(raw)
            except Exception:
                await manager.send_json(
                    user_id, {"type": "error", "message": "Invalid message format"}
                )
                continue

            # Persist user message
            user_msg = await _persist_message(db, user_id, data.content, "user")
            user_msg_out = MessageOut.model_validate(user_msg)
            await manager.send_json(
                user_id,
                {"type": "message", "data": json.loads(user_msg_out.model_dump_json())},
            )

            # Send typing indicator
            await manager.send_json(user_id, {"type": "typing"})

            # Simulate thinking time
            await asyncio.sleep(settings.bot_typing_delay)

            # Generate and persist bot response
            bot_content = generate_response(data.content)
            bot_msg = await _persist_message(db, user_id, bot_content, "bot")
            bot_msg_out = MessageOut.model_validate(bot_msg)
            await manager.send_json(
                user_id,
                {"type": "message", "data": json.loads(bot_msg_out.model_dump_json())},
            )

    except WebSocketDisconnect:
        logger.info("User %s disconnected", user_id)
    finally:
        manager.disconnect(user_id)
