from pydantic import BaseModel


class AddMemberSchema(BaseModel):

    email: str

    role: str = "member"