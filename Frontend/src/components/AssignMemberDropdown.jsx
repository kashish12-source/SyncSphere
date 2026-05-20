import {
  useEffect,
  useState,
  useContext
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getWorkspaceMembers,
  assignTask
} from "../api/memberApi"


function AssignMemberDropdown({

  workspaceId,
  taskId,
  onAssigned

}) {

  const {
    token
  } = useContext(AuthContext)


  const [members, setMembers] =
    useState([])

  const [selectedUser,
    setSelectedUser] =
      useState("")


  // FETCH MEMBERS
  useEffect(() => {

    const fetchMembers =
      async () => {

        try {

          const data =
            await getWorkspaceMembers(

              token,

              workspaceId
            )

          setMembers(data)

        } catch (error) {

          console.log(error)
        }
      }

    fetchMembers()

  }, [])


  // ASSIGN
  const handleAssign =
    async (e) => {

      const userId =
        e.target.value

      setSelectedUser(userId)

      try {

        const updatedTask =
          await assignTask(

            token,

            taskId,

            parseInt(userId)
          )

        onAssigned(updatedTask)

      } catch (error) {

        console.log(error)
      }
    }


  return (

    <div>

      <select

        value={selectedUser}

        onChange={handleAssign}

        className="
          w-full
          bg-white/80
          border
          border-gray-200
          rounded-xl
          px-3
          py-2
          text-sm
          outline-none
          focus:ring-2
          focus:ring-blue-400
        "
      >

        <option value="">
          Assign Member
        </option>


        {members.map((member) => (

          <option

            key={member.id}

            value={member.id}
          >

            {member.name}

          </option>

        ))}

      </select>

    </div>
  )
}

export default AssignMemberDropdown