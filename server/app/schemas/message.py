import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class MessageOut(BaseModel):
    id: uuid.UUID
    user_id: str
    content: str
    sender: Literal["user", "bot"]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WebSocketMessageIn(BaseModel):
    content: str
    user_id: str
