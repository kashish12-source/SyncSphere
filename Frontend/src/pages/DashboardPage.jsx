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

    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <div className="w-[250px] bg-white shadow-lg p-6">

        <h1 className="text-3xl font-bold text-blue-600 mb-10">

          SyncSpace

        </h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="w-full bg-blue-600 text-white p-3 rounded-xl"
        >
          + Create Workspace
        </button>

      </div>


      {/* MAIN CONTENT */}
      <div className="flex-1">

        {/* NAVBAR */}
        <div className="bg-white shadow p-4 flex justify-between items-center">

          <h2 className="text-2xl font-bold">

            Dashboard

          </h2>

          <div className="flex items-center gap-4">

            {/* NOTIFICATIONS */}
            <div className="relative">

              <button
                className="bg-yellow-400 px-4 py-2 rounded font-semibold"
              >
                Notifications
                {" "}
                ({notifications.length})
              </button>

            </div>

            {/* USER */}
            <span className="font-semibold">

              {user?.name}

            </span>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>

          </div>

        </div>


        {/* WORKSPACES */}
        <div className="p-8">

          <h2 className="text-3xl font-bold mb-6">

            Your Workspaces

          </h2>

          <div className="grid grid-cols-3 gap-6">

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