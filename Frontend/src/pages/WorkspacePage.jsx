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

import {
  connectWorkspaceSocket
} from "../websocket/socket"


function WorkspacePage() {

  const { workspaceId } = useParams()

  const {
    token
  } = useContext(AuthContext)

  const [tasks, setTasks] =
    useState([])

  const [showModal, setShowModal] =
    useState(false)


  // FETCH TASKS
  const fetchTasks = async () => {

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

    const ws =
      connectWorkspaceSocket(

        workspaceId,

        (data) => {

          console.log(
            "Live Event:",
            data
          )

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

    return () => {

      ws.close()
    }

  }, [])


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

        // UPDATE FRONTEND
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

        // UPDATE BACKEND
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

    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="bg-white shadow p-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-600">

          Workspace
          {" "}
          {workspaceId}

        </h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Task
        </button>

      </div>


      {/* DRAG CONTEXT */}
      <DndContext
        onDragEnd={
          handleDragEnd
        }
      >

        {/* KANBAN */}
        <div className="p-8 grid grid-cols-3 gap-6">

          <KanbanColumn
            title="Todo"
            tasks={todoTasks}
            columnId="todo"
          />

          <KanbanColumn
            title="In Progress"
            tasks={progressTasks}
            columnId="in_progress"
          />

          <KanbanColumn
            title="Done"
            tasks={doneTasks}
            columnId="done"
          />

        </div>

      </DndContext>


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