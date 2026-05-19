import api from "./axios"


export const getWorkspaceTasks = async (
  token,
  workspaceId
) => {

  const response = await api.get(

    `/tasks/${workspaceId}`,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}


export const createTask = async (
  token,
  taskData
) => {

  const response = await api.post(

    "/tasks/create",

    taskData,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}


// UPDATE TASK STATUS
export const updateTaskStatus = async (
  token,
  taskId,
  status
) => {

  const response = await api.put(

    `/tasks/${taskId}/status`,

    {
      status
    },

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}