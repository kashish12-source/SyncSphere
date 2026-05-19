from pydantic import BaseModel


class AttachmentResponse(BaseModel):

    id: int

    filename: str

    filepath: str

    task_id: int

    uploaded_by: int

    class Config:

        from_attributes = True