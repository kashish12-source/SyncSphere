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

from app.models.user import (
    User
)

from app.auth.jwt_handler import (
    get_current_user
)


router = APIRouter(

    prefix="/activity",

    tags=["Activity"]
)


# GET WORKSPACE ACTIVITY
@router.get("/{workspace_id}")
def get_workspace_activity(

    workspace_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    activities = db.query(
        Activity
    ).filter(

        Activity.workspace_id
        == workspace_id

    ).order_by(

        Activity.id.desc()

    ).all()


    return activities