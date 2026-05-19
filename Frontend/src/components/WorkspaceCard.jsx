import {
  useNavigate
} from "react-router-dom"


function WorkspaceCard({

  workspace

}) {

  const navigate =
    useNavigate()


  return (

    <div
      onClick={() =>

        navigate(

          `/workspace/${workspace.id}`
        )
      }

      className="
        bg-white/70
        backdrop-blur-lg
        rounded-3xl
        p-8
        shadow-xl
        cursor-pointer
        hover:scale-105
        transition
        border
        border-white/20
      "
    >

      {/* NAME */}
      <h2 className="
        text-3xl
        font-bold
        text-blue-600
        mb-4
      ">

        {workspace.name}

      </h2>


      {/* DESCRIPTION */}
      <p className="
        text-gray-600
        mb-5
      ">

        {workspace.description
          || "No description"}
      </p>


      {/* ROLE */}
      <div className="
        inline-block
        px-4
        py-2
        rounded-full
        bg-indigo-100
        text-indigo-700
        font-semibold
      ">

        Role:
        {" "}
        {workspace.role}

      </div>

    </div>
  )
}

export default WorkspaceCard