import {
  useContext,
  useEffect,
  useState
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getWorkspaceActivity
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


  // FETCH
  const fetchActivities =
    async () => {

      try {

        const data =
          await getWorkspaceActivity(

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


  // REALTIME
  useEffect(() => {

    if (!socket) return


    const handleMessage =
      (event) => {

        const data =
          JSON.parse(event.data)


        if (
          data.event ===
          "activity"
        ) {

          setActivities((prev) => [

            data.activity,

            ...prev
          ])
        }
      }


    socket.addEventListener(
      "message",
      handleMessage
    )


    return () => {

      socket.removeEventListener(
        "message",
        handleMessage
      )
    }

  }, [socket])


  return (

    <div className="
      bg-white/40
      backdrop-blur-lg
      border border-white/20
      rounded-3xl
      p-5
      shadow-xl
    ">

      <div className="
        flex
        justify-between
        items-center
        mb-5
      ">

        <h2 className="
          text-xl
          font-bold
          text-gray-800
        ">

          Activity Feed

        </h2>

      </div>


      {/* LIST */}
      <div className="
        space-y-4
        max-h-[500px]
        overflow-y-auto
      ">

        {activities.map((activity) => (

          <div

            key={activity.id}

            className="
              bg-white/70
              rounded-2xl
              p-4
              border
              border-white/20
            "
          >

            <p className="
              text-sm
              text-gray-700
            ">

              <span className="
                font-bold
                text-blue-700
              ">

                {activity.user}

              </span>

              {" "}

              {activity.action}

            </p>

          </div>

        ))}

      </div>

    </div>
  )
}

export default ActivityPanel