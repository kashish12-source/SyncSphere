import UserAvatar from "./UserAvatar.jsx"


function OnlineMembers({

  users

}) {

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

          Online Members

        </h2>


        <span className="
          bg-green-500
          text-white
          text-sm
          px-3
          py-1
          rounded-full
        ">

          {users.length} Online

        </span>

      </div>


      {/* MEMBERS */}
      <div className="
        flex
        flex-wrap
        gap-4
      ">

        {users.map((user, index) => (

          <div
            key={index}
            className="
              flex
              flex-col
              items-center
              gap-2
            "
          >

            <UserAvatar

              name={user}

              online={true}

              size="lg"

            />

            <span className="
              text-sm
              font-medium
              text-gray-700
            ">

              {user}

            </span>

          </div>

        ))}

      </div>

    </div>
  )
}

export default OnlineMembers