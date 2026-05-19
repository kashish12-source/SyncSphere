from pydantic import BaseModel

from typing import Optional


# CREATE TASK
class TaskCreate(BaseModel):

    title: str

    description: str

    priority: str

    workspace_id: int

    assigned_to: Optional[int] = None


# UPDATE STATUS
class TaskStatusUpdate(BaseModel):

    status: str


# ASSIGN TASK
class TaskAssign(BaseModel):

    assigned_to: int


# RESPONSE
class TaskResponse(BaseModel):

    id: int

    title: str

    description: str

    priority: str

    status: str

    workspace_id: int

    assigned_to: Optional[int]

    class Config:

        from_attributes = True