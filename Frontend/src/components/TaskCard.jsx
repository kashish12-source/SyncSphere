import {
  useDraggable
} from "@dnd-kit/core"


function TaskCard({ task }) {

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


  return (

    <div
      ref={setNodeRef}

      style={style}

      {...listeners}

      {...attributes}

      className="bg-white p-5 rounded-xl shadow cursor-grab"
    >

      <h2 className="text-xl font-bold">

        {task.title}

      </h2>

      <p className="text-gray-600 mt-2">

        {task.description}

      </p>

      <div className="mt-4 flex justify-between">

        <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">

          {task.priority}

        </span>

        <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">

          {task.status}

        </span>

      </div>

    </div>
  )
}

export default TaskCard