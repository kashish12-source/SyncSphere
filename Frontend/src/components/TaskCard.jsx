import {
  useDraggable
} from "@dnd-kit/core"

import {
  CSS
} from "@dnd-kit/utilities"

import CommentPanel from "./CommentPanel.jsx"

import AttachmentPanel from "./AttachmentPanel.jsx"

import AssignMemberDropdown from "./AssignMemberDropdown.jsx"

import UserAvatar from "./UserAvatar.jsx"


function TaskCard({

  task,
  workspaceId,
  onTaskAssigned

}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useDraggable({

    id: task.id
  })


  const style = {

    transform:
      CSS.Translate.toString(
        transform
      ),

    transition
  }


  return (

    <div

      ref={setNodeRef}

      style={style}

      className="
        bg-white/70
        backdrop-blur-lg
        rounded-3xl
        p-5
        shadow-xl
        border
        border-white/20
        space-y-5
      "
    >

      {/* DRAG HANDLE */}
      <div

        {...listeners}

        {...attributes}

        className="
          cursor-grab
          active:cursor-grabbing
        "
      >

        {/* TITLE */}
        <div>

          <h2 className="
            text-xl
            font-bold
            text-gray-800
          ">

            {task.title}

          </h2>


          <p className="
            text-gray-600
            mt-2
          ">

            {task.description}

          </p>

        </div>


        {/* PRIORITY */}
        <div className="
          mt-4
          flex
          justify-between
          items-center
        ">
          {task.due_date && (

  <div className="
    mt-3
  ">

    <span className="
      bg-red-100
      text-red-700
      text-xs
      px-3
      py-1
      rounded-full
      font-semibold
    ">

      Due:
      {" "}

      {new Date(
        task.due_date
      ).toLocaleString()}

    </span>

  </div>

)}

          <span className="
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
            bg-indigo-100
            text-indigo-700
          ">

            {task.priority}

          </span>

        </div>

      </div>


      {/* ASSIGNED USER */}
      {task.assigned_user && (

        <div className="
          bg-blue-50
          rounded-2xl
          p-3
        ">

          <p className="
            text-xs
            text-gray-500
            mb-2
          ">

            Assigned To

          </p>


          <UserAvatar

            user={task.assigned_user}

          />

        </div>

      )}


      {/* ASSIGN DROPDOWN */}
      <AssignMemberDropdown

        workspaceId={workspaceId}

        taskId={task.id}

        onAssigned={onTaskAssigned}

      />


      {/* COMMENTS */}
      <CommentPanel

        taskId={task.id}

      />


      {/* ATTACHMENTS */}
      <AttachmentPanel

        taskId={task.id}

      />

    </div>
  )
}

export default TaskCard