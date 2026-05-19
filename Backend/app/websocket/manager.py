from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):

        # WORKSPACE CONNECTIONS
        # {
        #   workspace_id: [websocket1, websocket2]
        # }

        self.active_connections = {}

        # USER PERSONAL CONNECTIONS
        # {
        #   user_id: websocket
        # }

        self.user_connections = {}

    # CONNECT TO WORKSPACE
    async def connect(
        self,
        workspace_id: int,
        websocket: WebSocket
    ):

        await websocket.accept()

        if workspace_id not in self.active_connections:

            self.active_connections[
                workspace_id
            ] = []

        self.active_connections[
            workspace_id
        ].append(websocket)

    # CONNECT USER SOCKET
    async def connect_user(
        self,
        user_id: int,
        websocket: WebSocket
    ):

        await websocket.accept()

        self.user_connections[
            user_id
        ] = websocket

    # DISCONNECT FROM WORKSPACE
    def disconnect(
        self,
        workspace_id: int,
        websocket: WebSocket
    ):

        self.active_connections[
            workspace_id
        ].remove(websocket)

    # BROADCAST TO WORKSPACE
    async def broadcast_to_workspace(
        self,
        workspace_id: int,
        message: dict
    ):

        if workspace_id in self.active_connections:

            for connection in self.active_connections[
                workspace_id
            ]:

                await connection.send_json(
                    message
                )

    # SEND PERSONAL MESSAGE
    async def send_personal_message(
        self,
        user_id: int,
        message: dict
    ):

        if user_id in self.user_connections:

            websocket = self.user_connections[
                user_id
            ]

            await websocket.send_json(
                message
            )


manager = ConnectionManager()