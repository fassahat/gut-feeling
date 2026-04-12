import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class MessageOut(BaseModel):
    id: uuid.UUID
    user_id: str
    content: str
    sender: Literal["user", "bot"]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WebSocketMessageIn(BaseModel):
    content: str = Field(min_length=1, max_length=4000)
