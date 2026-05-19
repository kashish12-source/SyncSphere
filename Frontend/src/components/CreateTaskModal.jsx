import {
  useState
} from "react"


function CreateTaskModal({

  onClose,
  onCreate

}) {

  const [formData, setFormData] =
    useState({

      title: "",
      description: "",
      priority: "medium",
      assigned_to: 1
    })


  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value
    })
  }


  const handleSubmit = (e) => {

    e.preventDefault()

    onCreate(formData)
  }


  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl w-[450px]">

        <h1 className="text-2xl font-bold mb-6">

          Create Task

        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Task Title"
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
          />

          <select
            name="priority"
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
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

          <input
            type="number"
            name="assigned_to"
            placeholder="Assign User ID"
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
          />

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
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