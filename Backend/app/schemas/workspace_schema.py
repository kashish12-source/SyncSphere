from pydantic import BaseModel


class WorkspaceCreate(BaseModel):
    name: str

class InviteMember(BaseModel):
    workspace_id: int
    user_email: str
    role: str = "member"

class WorkspaceResponse(BaseModel):
    id: int
    name: str
    owner_id: int

    class Config:
        from_attributes = True