import api from "./axios"


// GET NOTIFICATIONS
export const getNotifications =
  async (token) => {

    const response =
      await api.get(

        "/notification/",

        {
          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      )

    return response.data
}


// MARK AS READ
export const markNotificationRead =
  async (

    token,
    notificationId

  ) => {

    const response =
      await api.put(

        `/notification/${notificationId}/read`,

        {},

        {
          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      )

    return response.data
}