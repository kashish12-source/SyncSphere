from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.db.database import Base


class Comment(Base):

    __tablename__ = "comments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    content = Column(
        String,
        nullable=False
    )

    task_id = Column(
        Integer,
        ForeignKey("tasks.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )