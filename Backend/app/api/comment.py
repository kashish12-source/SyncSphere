from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.db.database import (
    get_db
)

from app.models.comment import (
    Comment
)

from app.models.user import (
    User
)

from app.auth.jwt_handler import (
    get_current_user
)


router = APIRouter(

    prefix="/comment",

    tags=["Comment"]
)


# SCHEMA
class CommentCreate(BaseModel):

    task_id: int

    content: str


# CREATE COMMENT
@router.post("/create")
def create_comment(

    comment: CommentCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    new_comment = Comment(

        task_id=comment.task_id,

        user_id=current_user.id,

        content=comment.content
    )

    db.add(new_comment)

    db.commit()

    db.refresh(new_comment)

    return new_comment


# GET COMMENTS
@router.get("/{task_id}")
def get_comments(

    task_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    comments = db.query(
        Comment
    ).filter(

        Comment.task_id
        == task_id

    ).all()


    return comments