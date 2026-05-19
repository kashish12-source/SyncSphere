import {
  useState,
  useEffect,
  useContext
} from "react"
import UserAvatar from "./UserAvatar.jsx"
import {
  useDraggable
} from "@dnd-kit/core"

import {
  motion
} from "framer-motion"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getWorkspaceMembers
} from "../api/memberApi"

import {
  assignTask
} from "../api/taskApi"

import CommentPanel from "./CommentPanel.jsx"

import AttachmentPanel from "./AttachmentPanel.jsx"


function TaskCard({

  task,
  socket

}) {

  // DRAGGING
  const {
    attributes,
    listeners,
    setNodeRef,
    transform
  } = useDraggable({

    id: task.id
  })


  const style = transform
    ? {
        transform:
          `translate3d(
            ${transform.x}px,
            ${transform.y}px,
            0
          )`
      }
    : undefined


  // AUTH
  const {
    token
  } = useContext(AuthContext)


  // STATES
  const [showComments, setShowComments] =
    useState(false)

  const [
    showAttachments,
    setShowAttachments
  ] = useState(false)

  const [members, setMembers] =
    useState([])


  // FETCH MEMBERS
  useEffect(() => {

    const fetchMembers =
      async () => {

        try {

          const data =
            await getWorkspaceMembers(

              token,

              task.workspace_id
            )

          setMembers(data)

        } catch (error) {

          console.log(error)
        }
      }

    fetchMembers()

  }, [])


  // ASSIGN USER
  const handleAssignUser =
    async (userId) => {

      try {

        await assignTask(

          token,

          task.id,

          parseInt(userId)
        )

      } catch (error) {

        console.log(error)
      }
    }


  // PRIORITY COLORS
  const priorityColors = {

    low:
      "bg-green-100 text-green-600",

    medium:
      "bg-yellow-100 text-yellow-700",

    high:
      "bg-red-100 text-red-600"
  }


  // FIND ASSIGNED USER
  const assignedUser =
    members.find(

      (member) =>

        member.id ===
        task.assigned_to
    )


  return (

    <motion.div

      whileHover={{
        scale: 1.03
      }}

      whileTap={{
        scale: 0.98
      }}

      ref={setNodeRef}

      style={style}

      {...listeners}

      {...attributes}

      className="
        bg-white/80
        backdrop-blur-md
        border border-white/20
        p-5
        rounded-2xl
        shadow-lg
        cursor-grab
        transition
      "
    >

      {/* TITLE */}
      <h2 className="
        text-xl
        font-bold
        text-gray-800
      ">

        {task.title}

      </h2>


      {/* DESCRIPTION */}
      <p className="
        text-gray-600
        mt-3
      ">

        {task.description}

      </p>


      {/* FOOTER */}
      <div className="
        mt-5
        flex
        justify-between
        items-center
      ">

        {/* PRIORITY */}
        <span
          className={`
            text-sm
            px-3
            py-1
            rounded-full
            font-semibold

            ${priorityColors[
              task.priority
            ]}
          `}
        >

          {task.priority}

        </span>


        {/* STATUS */}
        <span className="
          text-sm
          bg-blue-100
          text-blue-600
          px-3
          py-1
          rounded-full
          font-semibold
        ">

          {task.status}

        </span>

      </div>


      {/* ASSIGNED USER */}
      <div className="
        mt-5
      ">

        <label className="
          text-sm
          font-semibold
          text-gray-700
        ">

          Assign Task

        </label>


        <select

          onChange={(e) =>
            handleAssignUser(
              e.target.value
            )
          }

          value={
            task.assigned_to || ""
          }

          className="
            w-full
            mt-2
            border
            p-2
            rounded-xl
            bg-white
          "
        >

          <option value="">
            Unassigned
          </option>

          {members.map((member) => (

            <option
              key={member.id}
              value={member.id}
            >

              {member.name}

            </option>

          ))}

        </select>

      </div>


      {/* ASSIGNEE */}
{assignedUser && (

  <div className="
    mt-4
    flex
    items-center
    gap-3
  ">

    <UserAvatar

      name={assignedUser.name}

      online={true}

      size="md"

    />


    <div>

      <p className="
        text-sm
        text-gray-500
      ">

        Assigned To

      </p>

      <p className="
        font-semibold
        text-gray-800
      ">

        {assignedUser.name}

      </p>

    </div>

  </div>

)}


      {/* COMMENT BUTTON */}
      <button

        onClick={() =>
          setShowComments(
            !showComments
          )
        }

        className="
          mt-5
          w-full
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          py-2
          rounded-xl
          font-semibold
          transition
        "
      >

        {showComments
          ? "Hide Comments"
          : "Open Discussion"}

      </button>


      {/* ATTACHMENT BUTTON */}
      <button

        onClick={() =>
          setShowAttachments(
            !showAttachments
          )
        }

        className="
          mt-3
          w-full
          bg-emerald-600
          hover:bg-emerald-700
          text-white
          py-2
          rounded-xl
          font-semibold
          transition
        "
      >

        {showAttachments
          ? "Hide Files"
          : "Attachments"}

      </button>


      {/* COMMENTS */}
      {showComments && (

        <CommentPanel

          task={task}

          socket={socket}

        />

      )}


      {/* ATTACHMENTS */}
      {showAttachments && (

        <AttachmentPanel
          taskId={task.id}
          task={task}

          socket={socket}

        />

      )}

    </motion.div>
  )
}

export default TaskCard