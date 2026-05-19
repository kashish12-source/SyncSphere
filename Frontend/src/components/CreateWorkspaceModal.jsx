import {
  useState
} from "react"


function CreateWorkspaceModal({

  onClose,
  onCreate

}) {

  const [name, setName] = useState("")


  const handleSubmit = (e) => {

    e.preventDefault()

    onCreate({
      name
    })
  }


  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl w-[400px]">

        <h1 className="text-2xl font-bold mb-6">

          Create Workspace

        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Workspace Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
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

export default CreateWorkspaceModal