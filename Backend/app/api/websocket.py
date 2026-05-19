from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect
)

from app.websocket.manager import manager


router = APIRouter()


# WORKSPACE WEBSOCKET
@router.websocket("/ws/{workspace_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    workspace_id: int
):

    await manager.connect(
        workspace_id,
        websocket
    )

    try:

        while True:

            data = await websocket.receive_text()

            await manager.broadcast_to_workspace(
                workspace_id,
                {
                    "workspace_id": workspace_id,
                    "message": data
                }
            )

    except WebSocketDisconnect:

        manager.disconnect(
            workspace_id,
            websocket
        )


# USER PERSONAL WEBSOCKET
@router.websocket("/ws/user/{user_id}")
async def user_websocket(
    websocket: WebSocket,
    user_id: int
):

    await manager.connect_user(
        user_id,
        websocket
    )

    try:

        while True:

            await websocket.receive_text()

    except WebSocketDisconnect:

        pass