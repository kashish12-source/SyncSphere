from sqlalchemy.orm import Session

from app.models.activity import (
    Activity
)

from app.websocket.manager import (
    manager
)


async def log_activity(

    db: Session,

    workspace_id: int,

    user: str,

    action: str
):

    activity = Activity(

        action=action,

        workspace_id=workspace_id,

        user=user
    )

    db.add(activity)

    db.commit()

    db.refresh(activity)


    # WEBSOCKET EVENT
    await manager.broadcast(

        workspace_id,

        {
            "event":
                "activity_created",

            "activity":
                {
                    "id":
                        activity.id,

                    "action":
                        activity.action,

                    "workspace_id":
                        activity.workspace_id,

                    "user":
                        activity.user
                }
        }
    )