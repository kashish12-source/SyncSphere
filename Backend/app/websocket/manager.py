from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):

        # WORKSPACE CONNECTIONS
        self.active_connections = {}

        # ONLINE USERS
        self.online_users = {}


    # CONNECT
    async def connect(
        self,
        workspace_id: int,
        user_id: int,
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


        # TRACK ONLINE USERS
        if workspace_id not in self.online_users:

            self.online_users[
                workspace_id
            ] = set()

        self.online_users[
            workspace_id
        ].add(user_id)


        # BROADCAST ONLINE USERS
        await self.broadcast_online_users(
            workspace_id
        )


    # DISCONNECT
    async def disconnect(
        self,
        workspace_id: int,
        user_id: int,
        websocket: WebSocket
    ):

        self.active_connections[
            workspace_id
        ].remove(websocket)

        # REMOVE USER
        if workspace_id in self.online_users:

            self.online_users[
                workspace_id
            ].discard(user_id)

        # BROADCAST UPDATED USERS
        await self.broadcast_online_users(
            workspace_id
        )


    # BROADCAST
    async def broadcast(
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


    # ONLINE USERS EVENT
    async def broadcast_online_users(
        self,
        workspace_id: int
    ):

        users = list(

            self.online_users.get(
                workspace_id,
                []
            )
        )

        await self.broadcast(

            workspace_id,

            {
                "event":
                    "online_users",

                "users":
                    users
            }
        )


manager = ConnectionManager()