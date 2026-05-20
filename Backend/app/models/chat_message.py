from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)
from sqlalchemy.sql import func

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

    user = Column(String)

    message = Column(String)

    created_at = Column(
        DateTime(timezone=True), 
        server_default=func.now()
    )