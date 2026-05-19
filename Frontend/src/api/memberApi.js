import api from "./axios"


// GET WORKSPACE MEMBERS
export const getWorkspaceMembers =
  async (

    token,
    workspaceId

  ) => {

    const response = await api.get(

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