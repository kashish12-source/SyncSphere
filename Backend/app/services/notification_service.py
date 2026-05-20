from sqlalchemy.orm import Session

from app.models.notification import (
    Notification
)

from app.websocket.manager import (
    manager
)


async def create_notification(

    db: Session,

    user_id: int,

    workspace_id: int,

    title: str,

    message: str
):

    notification = Notification(

        user_id=user_id,

        title=title,

        message=message
    )

    db.add(notification)

    db.commit()

    db.refresh(notification)


    # REALTIME PUSH
    await manager.broadcast(

        workspace_id,

        {
            "event":
                "notification",

            "notification": {

                "id":
                    notification.id,

                "title":
                    notification.title,

                "message":
                    notification.message,

                "is_read":
                    notification.is_read
            }
        }
    )