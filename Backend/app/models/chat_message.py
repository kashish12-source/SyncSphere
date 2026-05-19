from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from datetime import datetime

from app.db.database import Base


class ChatMessage(Base):

    __tablename__ = "chat_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id")
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    sender_name = Column(
        String
    )

    message = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )