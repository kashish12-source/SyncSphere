from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect
)

from app.websocket.manager import (
    manager
)


router = APIRouter()


# WORKSPACE SOCKET
@router.websocket(
    "/ws/{workspace_id}/{username}"
)
async def websocket_endpoint(

    websocket: WebSocket,

    workspace_id: int,

    username: str
):

    await manager.connect(

        workspace_id,

        username,

        websocket
    )

    try:

        while True:

            data = await websocket.receive_json()


            # TYPING EVENT
            if data.get("event") == "typing":

                await manager.broadcast(

                    workspace_id,

                    {
                        "event":
                            "typing",

                        "user":
                            data.get(
                                "user"
                            )
                    }
                )


            # CHAT MESSAGE
            elif data.get("event") == "message":

                await manager.broadcast(

                    workspace_id,

                    {
                        "event":
                            "message",

                        "user":
                            data.get(
                                "user"
                            ),

                        "message":
                            data.get(
                                "message"
                            )
                    }
                )

    except WebSocketDisconnect:

        await manager.disconnect(

            workspace_id,

            username,

            websocket
        )