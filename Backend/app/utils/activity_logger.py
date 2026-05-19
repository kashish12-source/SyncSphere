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

    user_id: int,

    action: str
):

    activity = Activity(

        action=action,

        workspace_id=workspace_id,

        user_id=user_id
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

                    "user_id":
                        activity.user_id
                }
        }
    )