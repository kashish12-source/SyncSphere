from pydantic import BaseModel


# CREATE WORKSPACE
class WorkspaceCreate(BaseModel):

    name: str

    description: str


# RESPONSE
class WorkspaceResponse(BaseModel):

    id: int

    name: str

    description: str

    owner_id: int

    class Config:

        from_attributes = True