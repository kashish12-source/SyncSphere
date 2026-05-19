from pydantic import BaseModel


class ChatCreate(BaseModel):

    workspace_id: int

    message: str