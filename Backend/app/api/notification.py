from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.notification import Notification
from app.models.user import User

from app.auth.oauth2 import get_current_user


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# GET USER NOTIFICATIONS
@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    notifications = db.query(
        Notification
    ).filter(
        Notification.user_id == current_user.id
    ).all()

    return notifications


# MARK AS READ
@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    notification = db.query(
        Notification
    ).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()

    if notification:

        notification.is_read = True

        db.commit()

    return {
        "message": "Notification updated"
    }