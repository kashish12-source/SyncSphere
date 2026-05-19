from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect
)

from app.websocket.manager import (
    manager
)


router = APIRouter()


@router.websocket("/ws/{workspace_id}/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    workspace_id: int,
    user_id: int
):

    await manager.connect(
        workspace_id,
        user_id,
        websocket
    )

    try:

        while True:

            data = await websocket.receive_text()

            ## TYPING EVENT
        if data["event"] == "typing":

            await manager.broadcast_typing(

            workspace_id,

        {
            "event":
            "typing",

            "user":
            data["user"]
        }
    )

    except WebSocketDisconnect:

        await manager.disconnect(
            workspace_id,
            user_id,
            websocket
        )