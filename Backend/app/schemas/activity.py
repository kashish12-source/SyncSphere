from pydantic import BaseModel


class ActivityResponse(BaseModel):

    id: int

    action: str

    workspace_id: int

    user_id: int

    class Config:

        orm_mode = True