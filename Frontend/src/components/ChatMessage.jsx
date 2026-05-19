function ChatMessage({

  message

}) {

  return (

    <div className="
      bg-white/70
      backdrop-blur-lg
      rounded-2xl
      p-4
      shadow-md
    ">

      <div className="
        flex
        justify-between
        mb-2
      ">

        <h3 className="
          font-bold
          text-blue-600
        ">

          {message.sender_name}

        </h3>


        <span className="
          text-xs
          text-gray-500
        ">

          {new Date(
            message.created_at
          ).toLocaleTimeString()}

        </span>

      </div>


      <p className="
        text-gray-700
      ">

        {message.message}

      </p>

    </div>
  )
}

export default ChatMessage