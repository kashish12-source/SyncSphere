from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect
)

from app.websocket.manager import (
    manager
)


router = APIRouter()


@router.websocket(
    "/ws/{workspace_id}/{username}"
)
async def websocket_endpoint(

    websocket: WebSocket,

    workspace_id: int,

    username: str
):

    # CONNECT
    await manager.connect(

        workspace_id,

        username,

        websocket
    )

    try:

        while True:

            # RECEIVE MESSAGE
            data = await websocket.receive_json()


            # BROADCAST TO WORKSPACE
            await manager.broadcast(

                workspace_id,

                data
            )

    except WebSocketDisconnect:

        # DISCONNECT
        await manager.disconnect(

            workspace_id,

            username,

            websocket
        )