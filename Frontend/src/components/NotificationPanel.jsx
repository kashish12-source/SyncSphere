import {
  useContext,
  useEffect,
  useState
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getNotifications,
  markNotificationRead
} from "../api/notificationApi"


function NotificationPanel() {

  const {
    token
  } = useContext(AuthContext)


  const [notifications, setNotifications] =
    useState([])

  const [open, setOpen] =
    useState(false)


  // FETCH
  const fetchNotifications =
    async () => {

      try {

        const data =
          await getNotifications(
            token
          )

        setNotifications(data)

      } catch (error) {

        console.log(error)
      }
    }


  useEffect(() => {

    fetchNotifications()

  }, [])


  // MARK READ
  const handleRead =
    async (id) => {

      try {

        await markNotificationRead(
          token,
          id
        )

        setNotifications((prev) =>

          prev.map((n) =>

            n.id === id

              ? {
                  ...n,
                  is_read: true
                }

              : n
          )
        )

      } catch (error) {

        console.log(error)
      }
    }


  const unreadCount =

    notifications.filter(

      (n) => !n.is_read

    ).length


  return (

    <div className="
      relative
    ">

      {/* BUTTON */}
      <button

        onClick={() =>
          setOpen(!open)
        }

        className="
          relative
          bg-white/70
          rounded-2xl
          p-3
          shadow-lg
        "
      >

        🔔


        {unreadCount > 0 && (

          <span className="
            absolute
            -top-2
            -right-2
            bg-red-500
            text-white
            text-xs
            w-6
            h-6
            rounded-full
            flex
            items-center
            justify-center
          ">

            {unreadCount}

          </span>

        )}

      </button>


      {/* PANEL */}
      {open && (

        <div className="
          absolute
          right-0
          mt-3
          w-[350px]
          max-h-[500px]
          overflow-y-auto
          bg-white/90
          backdrop-blur-xl
          rounded-3xl
          shadow-2xl
          p-4
          space-y-3
          z-50
        ">

          <h2 className="
            text-xl
            font-bold
            mb-3
          ">

            Notifications

          </h2>


          {notifications.map((notification) => (

            <div

              key={notification.id}

              onClick={() =>
                handleRead(
                  notification.id
                )
              }

              className={`
                p-4
                rounded-2xl
                cursor-pointer
                border

                ${
                  notification.is_read

                    ? "bg-white"

                    : "bg-blue-100 border-blue-300"
                }
              `}
            >

              <h3 className="
                font-bold
              ">

                {notification.title}

              </h3>


              <p className="
                text-sm
                text-gray-600
                mt-1
              ">

                {notification.message}

              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default NotificationPanel