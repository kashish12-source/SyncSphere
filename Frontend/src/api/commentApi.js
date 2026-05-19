import api from "./axios"


export const createComment = async (

  token,
  commentData

) => {

  const response = await api.post(

    "/comments/create",

    commentData,

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  )

  return response.data
}


export const getComments = async (

  token,
  taskId

) => {

  const response = await api.get(

    `/comments/${taskId}`,

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  )

  return response.data
}