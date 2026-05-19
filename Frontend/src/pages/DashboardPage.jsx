import {
  useContext,
  useEffect,
  useState
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getMyWorkspaces,
  createWorkspace
} from "../api/workspaceApi"

import WorkspaceCard from "../components/WorkspaceCard.jsx"

import CreateWorkspaceModal from "../components/CreateWorkspaceModal.jsx"

import {
  connectNotificationSocket
} from "../websocket/socket"


function DashboardPage() {

  const {
    user,
    token,
    logout
  } = useContext(AuthContext)

  const [workspaces, setWorkspaces] =
    useState([])

  const [showModal, setShowModal] =
    useState(false)

  // LIVE NOTIFICATIONS
  const [notifications, setNotifications] =
    useState([])


  // FETCH WORKSPACES
  const fetchWorkspaces = async () => {

    try {

      const data =
        await getMyWorkspaces(token)

      setWorkspaces(data)

    } catch (error) {

      console.log(error)
    }
  }


  // INITIAL LOAD
  useEffect(() => {

    fetchWorkspaces()

  }, [])


  // NOTIFICATION SOCKET
  useEffect(() => {

    if (!user) return

    const ws =
      connectNotificationSocket(

        user.id,

        (data) => {

          console.log(
            "Notification:",
            data
          )

          if (
            data.event ===
            "notification"
          ) {

            setNotifications((prev) => [

              data.message,

              ...prev
            ])
          }
        }
      )

    return () => {

      ws.close()
    }

  }, [user])


  // CREATE WORKSPACE
  const handleCreateWorkspace =
    async (workspaceData) => {

      try {

        await createWorkspace(
          token,
          workspaceData
        )

        setShowModal(false)

        fetchWorkspaces()

      } catch (error) {

        console.log(error)
      }
    }


  return (

    <div className="
      min-h-screen
      bg-linear-to-br
      from-slate-100
      via-blue-100
      to-indigo-200
      flex
    ">

      {/* SIDEBAR */}
      <div className="
        w-[260px]
        bg-white/40
        backdrop-blur-lg
        border-r
        border-white/20
        shadow-xl
        p-6
      ">

        <h1 className="
          text-4xl
          font-extrabold
          text-blue-700
          mb-10
        ">

          SyncSphere

        </h1>


        <button
          onClick={() =>
            setShowModal(true)
          }
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            p-4
            rounded-2xl
            font-semibold
            shadow-lg
            transition
          "
        >
          + Create Workspace
        </button>

      </div>


      {/* MAIN CONTENT */}
      <div className="flex-1">

        {/* NAVBAR */}
        <div className="
          bg-white/50
          backdrop-blur-lg
          border-b
          border-white/20
          shadow-md
          p-5
          flex
          justify-between
          items-center
        ">

          <div>

            <h2 className="
              text-3xl
              font-extrabold
              text-blue-700
            ">

              Dashboard

            </h2>

            <p className="text-gray-600 mt-1">

              Real-time collaboration platform

            </p>

          </div>


          <div className="
            flex
            items-center
            gap-5
          ">

            {/* NOTIFICATIONS */}
            <div className="relative">

              <button
                className="
                  bg-yellow-400
                  hover:bg-yellow-500
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  shadow-md
                  transition
                "
              >
                Notifications
                {" "}
                ({notifications.length})
              </button>

            </div>


            {/* USER */}
            <div className="
              bg-white/60
              backdrop-blur-md
              px-4
              py-2
              rounded-2xl
              shadow
              font-semibold
            ">

              {user?.name}

            </div>


            {/* LOGOUT */}
            <button
              onClick={logout}
              className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-5
                py-3
                rounded-2xl
                font-semibold
                shadow-lg
                transition
              "
            >
              Logout
            </button>

          </div>

        </div>


        {/* WORKSPACES */}
        <div className="p-8">

          <div className="
            flex
            justify-between
            items-center
            mb-8
          ">

            <h2 className="
              text-4xl
              font-extrabold
              text-gray-800
            ">

              Your Workspaces

            </h2>

            <div className="
              bg-white/60
              backdrop-blur-md
              px-5
              py-2
              rounded-2xl
              shadow
              font-semibold
            ">

              {workspaces.length}
              {" "}
              Workspace(s)

            </div>

          </div>


          {/* WORKSPACE GRID */}
          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
          ">

            {workspaces?.map((workspace) => (

              <WorkspaceCard
                key={workspace.workspace_id}
                workspace={workspace}
              />

            ))}

          </div>

        </div>

      </div>


      {/* MODAL */}
      {showModal && (

        <CreateWorkspaceModal
          onClose={() =>
            setShowModal(false)
          }
          onCreate={
            handleCreateWorkspace
          }
        />

      )}

    </div>
  )
}

export default DashboardPage