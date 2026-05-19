function UserAvatar({

  name,
  online = false,
  size = "md"

}) {

  // SIZE STYLES
  const sizes = {

    sm:
      "w-8 h-8 text-sm",

    md:
      "w-10 h-10 text-base",

    lg:
      "w-14 h-14 text-lg"
  }


  return (

    <div className="
      relative
      flex
      items-center
      justify-center
    ">

      {/* AVATAR */}
      <div
        className={`
          ${sizes[size]}

          rounded-full

          bg-indigo-600

          text-white

          font-bold

          flex

          items-center

          justify-center

          shadow-md
        `}
      >

        {name
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
          border-2
          border-white
          rounded-full
        " />

      )}

    </div>
  )
}

export default UserAvatar   