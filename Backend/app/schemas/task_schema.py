from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):

    title: str

    description: Optional[str] = None

    priority: Optional[str] = "medium"

    deadline: Optional[datetime] = None

    workspace_id: int

    assigned_to: int


class TaskUpdate(BaseModel):

    title: Optional[str] = None

    description: Optional[str] = None

    status: Optional[str] = None

    priority: Optional[str] = None

    deadline: Optional[datetime] = None

    assigned_to: Optional[int] = None