from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.db.database import Base


class Attachment(Base):

    __tablename__ = "attachments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String,
        nullable=False
    )

    filepath = Column(
        String,
        nullable=False
    )

    task_id = Column(
        Integer,
        ForeignKey("tasks.id")
    )

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id")
    )   