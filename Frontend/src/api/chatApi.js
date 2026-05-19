import api from "./axios"


// GET CHAT
export const getChatMessages =
  async (

    token,

    workspaceId

  ) => {

    const response = await api.get(

      `/chat/${workspaceId}`,

      {
        headers: {

          Authorization:
            `Bearer ${token}`
        }
      }
    )

    return response.data
}


// SEND MESSAGE
export const sendChatMessage =
  async (

    token,

    messageData

  ) => {

    const response = await api.post(

      "/chat/send",

      messageData,

      {
        headers: {

          Authorization:
            `Bearer ${token}`
        }
      }
    )

    return response.data
}