import {
  useNavigate
} from "react-router-dom"

function WorkspaceCard({ workspace }) {

  const navigate = useNavigate()

  return (

    <div
      onClick={() =>
        navigate(
          `/workspace/${workspace.workspace_id}`
        )
      }
      className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
    >

      <h2 className="text-2xl font-bold text-blue-600">

        {workspace.workspace_name}

      </h2>

      <p className="text-gray-500 mt-2">

        Role:
        {" "}
        {workspace.role}

      </p>

    </div>
  )
}

export default WorkspaceCard