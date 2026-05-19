from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import (
    get_db
)

from app.models.activity import (
    Activity
)


router = APIRouter(
    prefix="/activities",
    tags=["Activities"]
)


# GET WORKSPACE ACTIVITIES
@router.get("/{workspace_id}")
def get_workspace_activities(

    workspace_id: int,

    db: Session = Depends(get_db)
):

    activities = db.query(
        Activity
    ).filter(

        Activity.workspace_id
        == workspace_id

    ).all()

    return activities