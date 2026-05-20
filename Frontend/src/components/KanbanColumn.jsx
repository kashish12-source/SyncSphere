import {
  useDroppable
} from "@dnd-kit/core"

import TaskCard from "./TaskCard.jsx"


function KanbanColumn({

  title,
  tasks,
  columnId,
  workspaceId,
  onTaskAssigned

}) {

  const {
    setNodeRef
  } = useDroppable({

    id: columnId
  })


  return (

    <div

      ref={setNodeRef}

      className="
        bg-white/40
        backdrop-blur-lg
        rounded-3xl
        p-6
        shadow-xl
        border
        border-white/20
        min-h-[600px]
      "
    >

      {/* HEADER */}
      <div className="
        flex
        justify-between
        items-center
        mb-6
      ">

        <h2 className="
          text-2xl
          font-bold
          text-gray-800
        ">

          {title}

        </h2>


        <span className="
          bg-blue-100
          text-blue-700
          px-3
          py-1
          rounded-full
          text-sm
          font-semibold
        ">

          {tasks.length}

        </span>

      </div>


      {/* TASKS */}
      <div className="
        space-y-5
      ">

        {tasks.map((task) => (

          <TaskCard

            key={task.id}

            task={task}

            workspaceId={workspaceId}

            onTaskAssigned={
              onTaskAssigned
            }

          />

        ))}

      </div>

    </div>
  )
}

export default KanbanColumn