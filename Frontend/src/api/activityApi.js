import api from "./axios"


// GET ACTIVITY
export const getWorkspaceActivity =
  async (

    token,

    workspaceId

  ) => {

    const response =
      await api.get(

        `/activity/${workspaceId}`,

        {
          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      )

    return response.data
}