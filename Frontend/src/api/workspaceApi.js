import api from "./axios"


// GET MY WORKSPACES
export const getMyWorkspaces =
  async (token) => {

    const response = await api.get(

      "/workspace/my-workspaces",

      {
        headers: {

          Authorization:
            `Bearer ${token}`
        }
      }
    )

    return response.data
}


// CREATE WORKSPACE
export const createWorkspace =
  async (

    token,

    workspaceData

  ) => {

    const response = await api.post(

      "/workspace/create",

      workspaceData,

      {
        headers: {

          Authorization:
            `Bearer ${token}`
        }
      }
    )

    return response.data
}


// GET MEMBERS
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


// ADD MEMBER
export const addWorkspaceMember =
  async (

    token,

    workspaceId,

    memberData

  ) => {

    const response = await api.post(

      `/workspace/${workspaceId}/add-member`,

      memberData,

      {
        headers: {

          Authorization:
            `Bearer ${token}`
        }
      }
    )

    return response.data
}