from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import (
    get_db
)

from app.models.chat_message import (
    ChatMessage
)

from app.models.user import (
    User
)

from app.schemas.chat import (
    ChatCreate
)

from app.auth.jwt_handler import (
    get_current_user
)

from app.websocket.manager import (
    manager
)


router = APIRouter(

    prefix="/chat",

    tags=["Chat"]
)


# SEND MESSAGE
@router.post("/send")
async def send_message(

    chat: ChatCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    new_message = ChatMessage(

        workspace_id=
        chat.workspace_id,

        user=
        current_user.name,

        message=
        chat.message
    )

    db.add(new_message)

    db.commit()

    db.refresh(new_message)


    # REALTIME BROADCAST
    await manager.broadcast(

        chat.workspace_id,

        {
            "event":
            "chat_message",

            "message": {

                "id":
                new_message.id,

                "workspace_id":
                new_message.workspace_id,

                "sender_name":
                new_message.user,

                "message":
                new_message.message,

                "created_at":
                str(
                    new_message.created_at
                )
            }
        }
    )


    return new_message


# GET CHAT HISTORY
@router.get("/{workspace_id}")
def get_chat_messages(

    workspace_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    messages = db.query(
        ChatMessage
    ).filter(

        ChatMessage.workspace_id
        == workspace_id

    ).order_by(

        ChatMessage.created_at.asc()

    ).all()


    return messages