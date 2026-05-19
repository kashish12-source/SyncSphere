from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from sqlalchemy.orm import relationship

from app.db.database import Base


class Task(Base):

    __tablename__ = "tasks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(String)

    status = Column(
        String,
        default="todo"
    )

    priority = Column(
        String,
        default="medium"
    )

    deadline = Column(DateTime)

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id")
    )

    assigned_to = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    workspace = relationship("Workspace")

    assignee = relationship(
        "User",
        foreign_keys=[assigned_to]
    )

    creator = relationship(
        "User",
        foreign_keys=[created_by]
    )