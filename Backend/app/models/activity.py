from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import (
    relationship
)

from app.db.database import Base


class Activity(Base):

    __tablename__ = "activities"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id")
    )

    user_id = Column(Integer)

    action = Column(String)


    # RELATIONSHIP
    workspace = relationship(
        "Workspace",
        back_populates="activities"
    )