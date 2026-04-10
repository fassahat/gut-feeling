from typing import Annotated

from fastapi import APIRouter, Query
from sqlalchemy import select

from app.database import DbDep
from app.models.message import Message
from app.schemas.message import MessageOut

router = APIRouter(prefix="/api", tags=["messages"])


@router.get("/messages", response_model=list[MessageOut])
async def get_messages(
    user_id: Annotated[str, Query(min_length=1)],
    db: DbDep,
) -> list[Message]:
    result = await db.execute(
        select(Message)
        .where(Message.user_id == user_id)
        .order_by(Message.created_at.asc())
    )
    return list(result.scalars().all())
