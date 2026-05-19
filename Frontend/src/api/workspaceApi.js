import api from "./axios"


export const getMyWorkspaces = async (
  token
) => {

  const response = await api.get(

    "/workspace/my-workspaces",

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}


export const createWorkspace = async (
  token,
  workspaceData
) => {

  const response = await api.post(

    "/workspace/create",

    workspaceData,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}