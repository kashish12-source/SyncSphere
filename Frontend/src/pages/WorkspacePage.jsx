import {
  useContext,
  useEffect,
  useState
} from "react"

import {
  useParams
} from "react-router-dom"

import {
  DndContext
} from "@dnd-kit/core"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getWorkspaceTasks,
  createTask,
  updateTaskStatus
} from "../api/taskApi"

import CreateTaskModal from "../components/CreateTaskModal.jsx"

import KanbanColumn from "../components/KanbanColumn.jsx"

import ActivityPanel from "../components/ActivityPanel.jsx"

import OnlineMembers from "../components/OnlineMembers.jsx"

import MembersPanel from "../components/MembersPanel.jsx"

import ChatPanel from "../components/ChatPanel.jsx"

import {
  connectWorkspaceSocket
} from "../websocket/socket"


function WorkspacePage() {

  const { workspaceId } =
    useParams()

  const {
    token,
    user
  } = useContext(AuthContext)


  // STATES
  const [tasks, setTasks] =
    useState([])

  const [showModal, setShowModal] =
    useState(false)

  const [onlineUsers, setOnlineUsers] =
    useState([])

  const [socket, setSocket] =
    useState(null)


  // FETCH TASKS
  const fetchTasks =
    async () => {

      try {

        const data =
          await getWorkspaceTasks(

            token,

            workspaceId
          )

        setTasks(data)

      } catch (error) {

        console.log(error)
      }
    }


  // INITIAL LOAD
  useEffect(() => {

    fetchTasks()

  }, [])


  // WEBSOCKET
  useEffect(() => {

    if (!user) return


    const ws =
      connectWorkspaceSocket(

        workspaceId,

        user.name,

        (data) => {

          console.log(
            "Live Event:",
            data
          )


          // ONLINE USERS
          if (
            data.event ===
            "online_users"
          ) {

            setOnlineUsers(
              data.users
            )
          }


          // TASK CREATED
          if (
            data.event ===
            "task_created"
          ) {

            setTasks((prev) => [

              ...prev,

              data.task
            ])
          }


          // TASK UPDATED
          if (
            data.event ===
            "task_updated"
          ) {

            setTasks((prev) =>

              prev.map((task) =>

                task.id ===
                data.task.id

                  ? {
                      ...task,
                      ...data.task
                    }

                  : task
              )
            )
          }


          // TASK ASSIGNED
          if (
            data.event ===
            "task_assigned"
          ) {

            setTasks((prev) =>

              prev.map((task) =>

                task.id ===
                data.task.id

                  ? {
                      ...task,

                      assigned_to:
                        data.task.assigned_to
                    }

                  : task
              )
            )
          }


          // TASK DELETED
          if (
            data.event ===
            "task_deleted"
          ) {

            setTasks((prev) =>

              prev.filter(

                (task) =>

                  task.id !==
                  data.task_id
              )
            )
          }
        }
      )

    setSocket(ws)

    return () => {

      ws.close()
    }

  }, [user])


  // CREATE TASK
  const handleCreateTask =
    async (taskData) => {

      try {

        await createTask(

          token,

          {
            ...taskData,

            workspace_id:
              parseInt(
                workspaceId
              )
          }
        )

        setShowModal(false)

      } catch (error) {

        console.log(error)
      }
    }


  // DRAG END
  const handleDragEnd =
    async (event) => {

      const {
        active,
        over
      } = event

      if (!over) return

      const taskId = active.id

      const newStatus = over.id


      try {

        // FRONTEND UPDATE
        setTasks((prev) =>

          prev.map((task) =>

            task.id === taskId

              ? {
                  ...task,
                  status: newStatus
                }

              : task
          )
        )

        // BACKEND UPDATE
        await updateTaskStatus(

          token,

          taskId,

          newStatus
        )

      } catch (error) {

        console.log(error)
      }
    }


  // FILTER TASKS
  const todoTasks = tasks.filter(

    (task) =>

      task.status === "todo"
  )

  const progressTasks =
    tasks.filter(

      (task) =>

        task.status ===
        "in_progress"
    )

  const doneTasks = tasks.filter(

    (task) =>

      task.status === "done"
  )


  return (

    <div className="
      min-h-screen
      bg-linear-to-br
      from-slate-100
      via-blue-100
      to-indigo-200
    ">

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

          <h1 className="
            text-3xl
            font-extrabold
            text-blue-700
          ">

            Workspace
            {" "}
            {workspaceId}

          </h1>

          <p className="
            text-gray-600
            mt-1
          ">

            Real-time collaboration board

          </p>

        </div>


        <button

          onClick={() =>
            setShowModal(true)
          }

          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-2xl
            font-semibold
            shadow-lg
            transition
          "
        >

          + Create Task

        </button>

      </div>


      {/* MAIN LAYOUT */}
      <div className="
        p-8
        grid
        grid-cols-1
        xl:grid-cols-4
        gap-8
      ">

        {/* LEFT SIDE */}
        <div className="
          xl:col-span-3
          space-y-8
        ">

          {/* TASK BOARD */}
          <DndContext
            onDragEnd={
              handleDragEnd
            }
          >

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            ">

              <KanbanColumn
                title="Todo"
                tasks={todoTasks}
                columnId="todo"
                socket={socket}
              />

              <KanbanColumn
                title="In Progress"
                tasks={progressTasks}
                columnId="in_progress"
                socket={socket}
              />

              <KanbanColumn
                title="Done"
                tasks={doneTasks}
                columnId="done"
                socket={socket}
              />

            </div>

          </DndContext>


          {/* CHAT PANEL */}
          <ChatPanel

            workspaceId={
              workspaceId
               
            }
            socket={socket}

          />

        </div>


        {/* RIGHT SIDEBAR */}
        <div className="
          space-y-6
        ">

          {/* ONLINE USERS */}
          <OnlineMembers
            users={onlineUsers}
          />


          {/* MEMBERS */}
          <MembersPanel

            workspaceId={
              workspaceId
            }

          />


          {/* ACTIVITY */}
          <ActivityPanel

            workspaceId={
              workspaceId
            }

            socket={socket}

          />

        </div>

      </div>


      {/* MODAL */}
      {showModal && (

        <CreateTaskModal

          onClose={() =>
            setShowModal(false)
          }

          onCreate={
            handleCreateTask
          }

        />

      )}

    </div>
  )
}

export default WorkspacePage