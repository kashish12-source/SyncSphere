from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from app.db.database import Base


class Task(Base):

    __tablename__ = "tasks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(String)

    description = Column(String)

    priority = Column(String)

    status = Column(
        String,
        default="todo"
    )

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id")
    )

    assigned_to = Column(
        Integer,
        nullable=True
    )

    due_date = Column(
        DateTime,
        nullable=True
    )