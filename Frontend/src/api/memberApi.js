import api from "./axios"


// GET WORKSPACE MEMBERS
export const getWorkspaceMembers =
  async (

    token,

    workspaceId

  ) => {

    const response =
      await api.get(

        `/workspace/${workspaceId}/members`,

        {
          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      )

    return response.data
}


// ASSIGN TASK
export const assignTask =
  async (

    token,

    taskId,

    userId

  ) => {

    const response =
      await api.put(

        `/tasks/${taskId}/assign`,

        {
          assigned_to: userId
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