import {
  useEffect,
  useState,
  useContext
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getActivities
} from "../api/activityApi"


function ActivityPanel({

  workspaceId,
  socket

}) {

  const {
    token
  } = useContext(AuthContext)

  const [activities, setActivities] =
    useState([])


  // FETCH ACTIVITIES
  const fetchActivities =
    async () => {

      try {

        const data =
          await getActivities(
            token,
            workspaceId
          )

        setActivities(data)

      } catch (error) {

        console.log(error)
      }
    }


  useEffect(() => {

    fetchActivities()

  }, [])


  // LIVE ACTIVITIES
  useEffect(() => {

    if (!socket) return

    socket.onmessage = (event) => {

      const data = JSON.parse(
        event.data
      )

      if (
        data.event ===
        "activity_created"
      ) {

        setActivities((prev) => [

          data.activity,

          ...prev
        ])
      }
    }

  }, [socket])


  return (

    <div className="
      bg-white/50
      backdrop-blur-lg
      rounded-3xl
      shadow-xl
      p-5
      h-full
    ">

      <h2 className="
        text-2xl
        font-bold
        mb-5
      ">

        Activity Timeline

      </h2>


      <div className="
        space-y-4
        max-h-[700px]
        overflow-y-auto
      ">

        {activities.map((activity) => (

          <div
            key={activity.id}
            className="
              bg-white
              p-4
              rounded-2xl
              shadow
            "
          >

            <p className="
              text-gray-800
              font-medium
            ">

              {activity.action}

            </p>

          </div>

        ))}

      </div>

    </div>
  )
}

export default ActivityPanel