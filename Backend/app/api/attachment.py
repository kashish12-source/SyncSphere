import os

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import (
    get_db
)

from app.models.attachment import (
    Attachment
)

from app.models.task import (
    Task
)

from app.auth.jwt_handler import (
    get_current_user
)

from app.websocket.manager import (
    manager
)

from app.utils.activity_logger import (
    log_activity
)


router = APIRouter(
    prefix="/attachments",
    tags=["Attachments"]
)


UPLOAD_DIR = "uploads"


# UPLOAD FILE
@router.post("/upload/{task_id}")
async def upload_attachment(

    task_id: int,

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user = Depends(
        get_current_user
    )
):

    # FIND TASK
    task = db.query(
        Task
    ).filter(

        Task.id == task_id

    ).first()


    # CREATE FILE PATH
    filepath = os.path.join(

        UPLOAD_DIR,

        file.filename
    )


    # SAVE FILE
    with open(filepath, "wb") as buffer:

        content = await file.read()

        buffer.write(content)


    # SAVE DB RECORD
    attachment = Attachment(

        filename=file.filename,

        filepath=filepath,

        task_id=task_id,

        uploaded_by=current_user.id
    )

    db.add(attachment)

    db.commit()

    db.refresh(attachment)


    # ACTIVITY
    await log_activity(

        db,

        task.workspace_id,

        current_user.id,

        f"{current_user.name} uploaded '{file.filename}'"
    )


    # WEBSOCKET EVENT
    await manager.broadcast(

        task.workspace_id,

        {
            "event":
                "attachment_uploaded",

            "attachment":
                {
                    "id":
                        attachment.id,

                    "filename":
                        attachment.filename,

                    "filepath":
                        attachment.filepath,

                    "task_id":
                        attachment.task_id
                }
        }
    )

    return attachment


# GET TASK ATTACHMENTS
@router.get("/{task_id}")
def get_attachments(

    task_id: int,

    db: Session = Depends(get_db)
):

    attachments = db.query(
        Attachment
    ).filter(

        Attachment.task_id == task_id

    ).all()

    return attachments