// CONNECT WORKSPACE SOCKET
export const connectWorkspaceSocket = (

  workspaceId,
  username,
  onMessage

) => {

  const socket = new WebSocket(

    `ws://127.0.0.1:8000/ws/${workspaceId}/${username}`
  )


  // CONNECTED
  socket.onopen = () => {

    console.log(
      "Workspace socket connected"
    )
  }


  // MESSAGE
  socket.onmessage = (event) => {

    try {

      const data =
        JSON.parse(event.data)

      onMessage(data)

    } catch (error) {

      console.log(
        "Socket Parse Error:",
        error
      )
    }
  }


  // IGNORE DEV ERRORS
  socket.onerror = () => {

    // React strict mode causes temporary websocket reconnects
  }


  // CLOSED
  socket.onclose = () => {

    console.log(
      "Workspace socket disconnected"
    )
  }


  return socket
}