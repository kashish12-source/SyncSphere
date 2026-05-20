function NotificationItem({

  notification,
  onRead

}) {

  return (

    <div

      onClick={() =>
        onRead(
          notification.id
        )
      }

      className={`
        p-4
        rounded-2xl
        cursor-pointer
        transition
        border

        ${
          notification.is_read

            ? "bg-white/60"

            : "bg-blue-100 border-blue-300"
        }
      `}
    >

      {/* TITLE */}
      <h3 className="
        font-bold
        text-gray-800
        mb-1
      ">

        {notification.title}

      </h3>


      {/* MESSAGE */}
      <p className="
        text-sm
        text-gray-600
      ">

        {notification.message}

      </p>

    </div>
  )
}

export default NotificationItem