import {
  useContext,
  useEffect,
  useState
} from "react"

import {
  useNavigate
} from "react-router-dom"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getMyWorkspaces,
  createWorkspace
} from "../api/workspaceApi"

import WorkspaceCard from "../components/WorkspaceCard.jsx"

import NotificationPanel from "../components/NotificationPanel.jsx"

import CreateWorkspaceModal from "../components/CreateWorkspaceModal.jsx"


function DashboardPage() {

  const navigate =
    useNavigate()


  const {
    token,
    user
  } = useContext(AuthContext)


  // STATES
  const [workspaces, setWorkspaces] =
    useState([])

  const [showModal, setShowModal] =
    useState(false)


  // FETCH WORKSPACES
  const fetchWorkspaces =
    async () => {

      try {

        const data =
          await getMyWorkspaces(
            token
          )

        setWorkspaces(data)

      } catch (error) {

        console.log(error)
      }
    }


  // INITIAL LOAD
  useEffect(() => {

    if (token) {

      fetchWorkspaces()
    }

  }, [token])


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
        w-[300px]
        bg-white/40
        backdrop-blur-lg
        border-r
        border-white/20
        shadow-xl
        p-6
      ">

        {/* LOGO */}
        <h1 className="
          text-5xl
          font-extrabold
          text-blue-700
          mb-12
        ">

          SyncSphere

        </h1>


        {/* USER */}
        <div className="
          bg-white/60
          rounded-3xl
          p-4
          mb-8
          border
          border-white/20
        ">

          <p className="
            text-sm
            text-gray-500
          ">

            Logged in as

          </p>


          <h2 className="
            text-xl
            font-bold
            text-gray-800
            mt-1
          ">

            {user?.name}

          </h2>

        </div>


        {/* CREATE BUTTON */}
        <button

          onClick={() =>
            setShowModal(true)
          }

          className="
            w-full
            py-5
            rounded-3xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            text-xl
            font-bold
            shadow-lg
            transition
          "
        >

          + Create Workspace

        </button>

      </div>


      {/* MAIN */}
      <div className="
        flex-1
        overflow-y-auto
      ">

        {/* HEADER */}
        <div className="
          bg-white/50
          backdrop-blur-lg
          border-b
          border-white/20
          shadow-md
          px-8
          py-6
          flex
          justify-between
          items-center
        ">

          {/* LEFT */}
          <div>

            <h1 className="
              text-5xl
              font-extrabold
              text-blue-700
            ">

              Dashboard

            </h1>


            <p className="
              text-gray-600
              mt-2
              text-lg
            ">

              Real-time collaboration platform

            </p>

          </div>


          {/* RIGHT */}
          <div className="
            flex
            items-center
            gap-5
          ">

            <NotificationPanel />

          </div>

        </div>


        {/* CONTENT */}
        <div className="
          p-10
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-10
          ">

            <h2 className="
              text-6xl
              font-extrabold
              text-slate-800
            ">

              Your Workspaces

            </h2>

          </div>


          {/* WORKSPACE GRID */}
          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
          ">

            {workspaces.map((workspace) => (

              <WorkspaceCard

                key={workspace.id}

                workspace={workspace}

                onClick={() =>

                  navigate(

                    `/workspace/${workspace.id}`
                  )
                }

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