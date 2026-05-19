import api from "./axios"


// UPLOAD FILE
export const uploadAttachment = async (

  token,
  taskId,
  file

) => {

  const formData = new FormData()

  formData.append(
    "file",
    file
  )

  const response = await api.post(

    `/attachments/upload/${taskId}`,

    formData,

    {
      headers: {

        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "multipart/form-data"
      }
    }
  )

  return response.data
}


// GET ATTACHMENTS
export const getAttachments = async (

  token,
  taskId

) => {

  const response = await api.get(

    `/attachments/${taskId}`,

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  )

  return response.data
}