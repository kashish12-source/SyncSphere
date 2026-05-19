import api from "./axios"


export const getActivities = async (

  token,
  workspaceId

) => {

  const response = await api.get(

    `/activities/${workspaceId}`,

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  )

  return response.data
}
