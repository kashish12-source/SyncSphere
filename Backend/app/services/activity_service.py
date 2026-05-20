from sqlalchemy.orm import Session

from app.models.activity import (
    Activity
)

from app.websocket.manager import (
    manager
)


async def create_activity(

    db: Session,

    workspace_id: int,

    user: str,

    action: str
):

    activity = Activity(

        workspace_id=workspace_id,

        user=user,

        action=action
    )

    db.add(activity)

    db.commit()

    db.refresh(activity)


    # REALTIME EVENT
    await manager.broadcast(

        workspace_id,

        {
            "event":
                "activity",

            "activity": {

                "id":
                    activity.id,

                "user":
                    activity.user,

                "action":
                    activity.action
            }
        }
    )