import axios from "axios"


const API =
  "http://127.0.0.1:8000"


// =========================
// CREATE TASK
// =========================

export const createTask = async (

  token,
  taskData

) => {

  const response =
    await axios.post(

      `${API}/tasks/create`,

      taskData,

      {
        headers: {

          Authorization:
            `Bearer ${token}`
        }
      }
    )

  return response.data
}


// =========================
// GET WORKSPACE TASKS
// =========================

export const getWorkspaceTasks =
  async (

    token,
    workspaceId

  ) => {

    const response =
      await axios.get(

        `${API}/tasks/${workspaceId}`,

        {
          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      )

    return response.data
}


// =========================
// UPDATE TASK STATUS
// =========================

export const updateTaskStatus =
  async (

    token,
    taskId,
    status

  ) => {

    const response =
      await axios.put(

        `${API}/tasks/${taskId}/status`,

        {
          status
        },

        {
          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      )

    return response.data
}