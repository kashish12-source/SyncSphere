import UserAvatar from "./UserAvatar.jsx"


function MemberCard({

  member

}) {

  return (

    <div className="
      flex
      items-center
      justify-between
      bg-white/60
      backdrop-blur-lg
      rounded-2xl
      p-4
      shadow-md
      border
      border-white/20
    ">

      {/* LEFT */}
      <div className="
        flex
        items-center
        gap-3
      ">

        <UserAvatar

          name={member.name}

          online={true}

          size="md"

        />


        <div>

          <h3 className="
            font-semibold
            text-gray-800
          ">

            {member.name}

          </h3>


          <p className="
            text-sm
            text-gray-500
          ">

            {member.email}

          </p>

        </div>

      </div>


      {/* ROLE */}
      <div>

        {member.role ===
          "admin" ? (

          <span className="
            bg-yellow-100
            text-yellow-700
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
          ">

            👑 Admin

          </span>

        ) : (

          <span className="
            bg-blue-100
            text-blue-700
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
          ">

            Member

          </span>

        )}

      </div>

    </div>
  )
}

export default MemberCard