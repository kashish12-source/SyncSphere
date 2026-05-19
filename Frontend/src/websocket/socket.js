export const connectWorkspaceSocket = (
  workspaceId,
  onMessage
) => {

  const socket = new WebSocket(

    `ws://127.0.0.1:8000/ws/${workspaceId}`
  )

  socket.onopen = () => {

    console.log(
      "Workspace socket connected"
    )
  }

  socket.onmessage = (event) => {

    const data = JSON.parse(
      event.data
    )

    onMessage(data)
  }

  socket.onclose = () => {

    console.log(
      "Workspace socket disconnected"
    )
  }

  return socket
}



// PERSONAL NOTIFICATION SOCKET
export const connectNotificationSocket = (
  userId,
  onMessage
) => {

  const socket = new WebSocket(

    `ws://127.0.0.1:8000/ws/user/${userId}`
  )

  socket.onopen = () => {

    console.log(
      "Notification socket connected"
    )
  }

  socket.onmessage = (event) => {

    const data = JSON.parse(
      event.data
    )

    onMessage(data)
  }

  socket.onclose = () => {

    console.log(
      "Notification socket disconnected"
    )
  }

  return socket
}