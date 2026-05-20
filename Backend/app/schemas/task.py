from pydantic import BaseModel

from typing import Optional


class TaskCreate(BaseModel):

    title: str

    description: str

    priority: str

    workspace_id: int

    assigned_to: Optional[int] = None