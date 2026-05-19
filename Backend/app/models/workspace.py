from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import (
    relationship
)
from app.schemas.member import (
    AddMemberSchema
)

from app.db.database import Base


class Workspace(Base):

    __tablename__ = "workspaces"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=True
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    # RELATIONSHIPS
    members = relationship(
        "WorkspaceMember",
        back_populates="workspace",
        cascade="all, delete"
    )

    tasks = relationship(
        "Task",
        back_populates="workspace",
        cascade="all, delete"
    )

    activities = relationship(
        "Activity",
        back_populates="workspace",
        cascade="all, delete"
    )