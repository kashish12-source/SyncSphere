import {
  useState
} from "react"


function CreateTaskModal({

  onClose,
  onCreate

}) {

  const [title, setTitle] =
    useState("")

  const [description,
    setDescription] =
      useState("")

  const [priority,
    setPriority] =
      useState("medium")

  const [dueDate,
    setDueDate] =
      useState("")


  const handleSubmit =
    (e) => {

      e.preventDefault()

      onCreate({

        title,
        description,
        priority,

        due_date:
          dueDate || null
      })
    }


  return (

    <div className="
      fixed
      inset-0
      bg-black/40
      flex
      justify-center
      items-center
      z-50
    ">

      <div className="
        bg-white
        rounded-3xl
        p-8
        w-[500px]
        shadow-2xl
      ">

        <h2 className="
          text-3xl
          font-bold
          mb-6
        ">

          Create Task

        </h2>


        <form
          onSubmit={handleSubmit}
          className="
            space-y-5
          "
        >

          {/* TITLE */}
          <input

            type="text"

            placeholder="Task title"

            value={title}

            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }

            className="
              w-full
              border
              rounded-2xl
              p-4
              outline-none
            "

            required
          />


          {/* DESCRIPTION */}
          <textarea

            placeholder="Description"

            value={description}

            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }

            className="
              w-full
              border
              rounded-2xl
              p-4
              outline-none
              h-[120px]
            "
          />


          {/* PRIORITY */}
          <select

            value={priority}

            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }

            className="
              w-full
              border
              rounded-2xl
              p-4
              outline-none
            "
          >

            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

          </select>


          {/* DUE DATE */}
          <div>

            <label className="
              text-sm
              text-gray-500
              mb-2
              block
            ">

              Due Date

            </label>

            <input

              type="datetime-local"

              value={dueDate}

              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }

              className="
                w-full
                border
                rounded-2xl
                p-4
                outline-none
              "
            />

          </div>


          {/* BUTTONS */}
          <div className="
            flex
            justify-end
            gap-4
            pt-4
          ">

            <button

              type="button"

              onClick={onClose}

              className="
                px-6
                py-3
                rounded-2xl
                bg-gray-200
              "
            >

              Cancel

            </button>


            <button

              type="submit"

              className="
                px-6
                py-3
                rounded-2xl
                bg-blue-600
                text-white
                font-bold
              "
            >

              Create

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default CreateTaskModal