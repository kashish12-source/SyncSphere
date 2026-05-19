import {
  useDroppable
} from "@dnd-kit/core"

import TaskCard from "./TaskCard.jsx"


function KanbanColumn({

  title,
  tasks,
  columnId

}) {

  const {
    setNodeRef
  } = useDroppable({

    id: columnId
  })


  return (

    <div
      ref={setNodeRef}
      className="bg-gray-200 rounded-2xl p-4 min-h-[600px]"
    >

      <h2 className="text-2xl font-bold mb-6">

        {title}

      </h2>

      <div className="space-y-4">

        {tasks.map((task) => (

          <TaskCard
            key={task.id}
            task={task}
          />

        ))}

      </div>

    </div>
  )
}

export default KanbanColumn