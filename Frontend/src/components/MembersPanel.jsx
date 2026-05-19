import {
  useEffect,
  useState,
  useContext
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getWorkspaceMembers
} from "../api/workspaceApi"

import MemberCard from "./MemberCard.jsx"


function MembersPanel({

  workspaceId

}) {

  const {
    token
  } = useContext(AuthContext)


  const [members, setMembers] =
    useState([])


  // FETCH MEMBERS
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


  useEffect(() => {

    fetchMembers()

  }, [])


  return (

    <div className="
      bg-white/40
      backdrop-blur-lg
      border border-white/20
      rounded-3xl
      p-5
      shadow-xl
    ">

      <div className="
        flex
        justify-between
        items-center
        mb-5
      ">

        <h2 className="
          text-xl
          font-bold
          text-gray-800
        ">

          Team Members

        </h2>


        <span className="
          bg-indigo-500
          text-white
          text-sm
          px-3
          py-1
          rounded-full
        ">

          {members.length}
          {" "}
          Members

        </span>

      </div>


      {/* MEMBER LIST */}
      <div className="
        space-y-4
      ">

        {members.map((member) => (

          <MemberCard

            key={member.id}

            member={member}

          />

        ))}

      </div>

    </div>
  )
}

export default MembersPanel
