import {
  useDroppable
} from "@dnd-kit/core"

import {
  motion
} from "framer-motion"

import TaskCard from "./TaskCard.jsx"


function KanbanColumn({

  title,
  tasks,
  columnId,
  socket

}) {

  const {
    setNodeRef
  } = useDroppable({

    id: columnId
  })


  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 20
      }}

      animate={{
        opacity: 1,
        y: 0
      }}

      transition={{
        duration: 0.3
      }}

      ref={setNodeRef}

      className="
        bg-white/40
        backdrop-blur-lg
        border border-white/20
        rounded-3xl
        p-5
        min-h-[700px]
        shadow-xl
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
          bg-gray-800
          text-white
          px-3
          py-1
          rounded-full
          text-sm
        ">

          {tasks.length}

        </span>

      </div>


      {/* TASKS */}
      <div className="space-y-5">

        {tasks.map((task) => (

          <TaskCard

            key={task.id}

            task={task}

            socket={socket}

          />

        ))}

      </div>

    </motion.div>
  )
}

export default KanbanColumn