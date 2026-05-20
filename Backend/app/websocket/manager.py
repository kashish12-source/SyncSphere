from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):

        self.active_connections = {}


    # CONNECT
    async def connect(

        self,

        workspace_id: int,

        username: str,

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


    # DISCONNECT
    async def disconnect(

        self,

        workspace_id: int,

        username: str,

        websocket: WebSocket
    ):

        if workspace_id in self.active_connections:

            if websocket in self.active_connections[
                workspace_id
            ]:

                self.active_connections[
                    workspace_id
                ].remove(websocket)


    # BROADCAST
    async def broadcast(

        self,

        workspace_id: int,

        message: dict
    ):

        if workspace_id not in self.active_connections:

            return


        disconnected = []


        for connection in self.active_connections[
            workspace_id
        ]:

            try:

                await connection.send_json(
                    message
                )

            except:

                disconnected.append(
                    connection
                )


        # CLEAN DEAD SOCKETS
        for dead in disconnected:

            self.active_connections[
                workspace_id
            ].remove(dead)


manager = ConnectionManager()