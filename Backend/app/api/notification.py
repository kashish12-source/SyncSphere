from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import (
    get_db
)

from app.models.notification import (
    Notification
)

from app.models.user import (
    User
)

from app.auth.jwt_handler import (
    get_current_user
)


router = APIRouter(

    prefix="/notification",

    tags=["Notification"]
)


# GET NOTIFICATIONS
@router.get("/")
def get_notifications(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    notifications = db.query(
        Notification
    ).filter(

        Notification.user_id
        == current_user.id

    ).order_by(

        Notification.id.desc()

    ).all()


    return notifications


# MARK READ
@router.put("/{notification_id}/read")
def mark_read(

    notification_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    notification = db.query(
        Notification
    ).filter(

        Notification.id
        == notification_id

    ).first()


    if notification:

        notification.is_read = True

        db.commit()

        db.refresh(notification)


    return notification