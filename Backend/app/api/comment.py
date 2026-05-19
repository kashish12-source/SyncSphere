from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import (
    get_db
)

from app.models.comment import (
    Comment
)

from app.models.task import (
    Task
)

from app.schemas.comment import (
    CommentCreate
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
    prefix="/comments",
    tags=["Comments"]
)


# CREATE COMMENT
@router.post("/create")
async def create_comment(

    comment: CommentCreate,

    db: Session = Depends(get_db),

    current_user = Depends(
        get_current_user
    )
):

    # FIND TASK
    task = db.query(
        Task
    ).filter(

        Task.id == comment.task_id

    ).first()


    # CREATE COMMENT
    new_comment = Comment(

        content=comment.content,

        task_id=comment.task_id,

        user_id=current_user.id
    )

    db.add(new_comment)

    db.commit()

    db.refresh(new_comment)


    # ACTIVITY LOG
    await log_activity(

        db,

        task.workspace_id,

        current_user.id,

        f"{current_user.name} commented on '{task.title}'"
    )


    # WEBSOCKET EVENT
    await manager.broadcast(

        task.workspace_id,

        {
            "event":
                "comment_created",

            "comment":
                {
                    "id":
                        new_comment.id,

                    "content":
                        new_comment.content,

                    "task_id":
                        new_comment.task_id,

                    "user_id":
                        new_comment.user_id
                }
        }
    )

    return new_comment


# GET COMMENTS
@router.get("/{task_id}")
def get_comments(

    task_id: int,

    db: Session = Depends(get_db)
):

    comments = db.query(
        Comment
    ).filter(

        Comment.task_id == task_id

    ).all()

    return comments