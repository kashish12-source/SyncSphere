function UserAvatar({

  user,
  online = false

}) {

  if (!user) return null


  return (

    <div className="
      flex
      items-center
      gap-2
    ">

      {/* AVATAR */}
      <div className="
        relative
      ">

        <div className="
          w-10
          h-10
          rounded-full
          bg-blue-600
          text-white
          flex
          items-center
          justify-center
          font-bold
          shadow-md
        ">

          {user.name
            ?.charAt(0)
            ?.toUpperCase()}

        </div>


        {/* ONLINE DOT */}
        {online && (

          <div className="
            absolute
            bottom-0
            right-0
            w-3
            h-3
            bg-green-500
            rounded-full
            border-2
            border-white
          " />

        )}

      </div>


      {/* NAME */}
      <div>

        <p className="
          text-sm
          font-semibold
          text-gray-800
        ">

          {user.name}

        </p>

      </div>

    </div>
  )
}

export default UserAvatar