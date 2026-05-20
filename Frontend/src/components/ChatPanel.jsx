import {
  useEffect,
  useState,
  useContext,
  useRef
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getChatMessages,
  sendChatMessage
} from "../api/chatApi"

import ChatMessage from "./ChatMessage.jsx"


function ChatPanel({

  workspaceId,
  socket

}) {

  const {
    token
  } = useContext(AuthContext)


  // STATES
  const [messages, setMessages] =
    useState([])

  const [message, setMessage] =
    useState("")

  const [typingUser, setTypingUser] =
    useState("")


  const messagesEndRef =
    useRef(null)


  // FETCH CHAT
  const fetchMessages =
    async () => {

      try {

        const data =
          await getChatMessages(

            token,

            workspaceId
          )

        setMessages(data)

      } catch (error) {

        console.log(error)
      }
    }


  // AUTO SCROLL
  const scrollToBottom =
    () => {

      messagesEndRef.current
        ?.scrollIntoView({

          behavior: "smooth"
        })
    }


  // SEND MESSAGE
  const handleSendMessage =
    async (e) => {

      e.preventDefault()

      if (!message.trim())
        return

      try {

        await sendChatMessage(

          token,

          {
            workspace_id:
              parseInt(
                workspaceId
              ),

            message
          }
        )

        setMessage("")

      } catch (error) {

        console.log(error)
      }
    }


  // INITIAL LOAD
  useEffect(() => {

    fetchMessages()

  }, [])


  // AUTO SCROLL
  useEffect(() => {

    scrollToBottom()

  }, [messages])


  useEffect(() => {

  if (!socket) return


  const handleMessage =
    (event) => {

      const data =
        JSON.parse(event.data)

      console.log(
        "Realtime Event:",
        data
      )


      // CHAT MESSAGE
      if (
        data.event ===
        "chat_message"
      ) {

        setMessages((prev) => [

          ...prev,

          data.message
        ])
      }


      // TYPING
      if (
        data.event ===
        "typing"
      ) {

        setTypingUser(
          data.user
        )

        setTimeout(() => {

          setTypingUser("")

        }, 1500)
      }
    }


  socket.addEventListener(
    "message",
    handleMessage
  )


  return () => {

    socket.removeEventListener(
      "message",
      handleMessage
    )
  }

}, [socket])
  return (

    <div className="
      bg-white/40
      backdrop-blur-lg
      border border-white/20
      rounded-3xl
      shadow-xl
      flex
      flex-col
      h-[700px]
    ">

      {/* HEADER */}
      <div className="
        p-5
        border-b
        border-white/20
      ">

        <h2 className="
          text-2xl
          font-bold
          text-gray-800
        ">

          Team Chat

        </h2>

      </div>


      {/* MESSAGES */}
      <div className="
        flex-1
        overflow-y-auto
        p-5
        space-y-4
      ">

        {messages.map((msg) => (

          <ChatMessage

            key={msg.id}

            message={msg}

          />

        ))}

        <div ref={messagesEndRef} />

      </div>


      {/* TYPING */}
      {typingUser && (

        <div className="
          px-5
          pb-2
          text-sm
          text-gray-500
          italic
        ">

          {typingUser}
          {" "}
          is typing...

        </div>

      )}


      {/* INPUT */}
      <form

        onSubmit={
          handleSendMessage
        }

        className="
          p-5
          border-t
          border-white/20
          flex
          gap-3
        "
      >

        <input

          type="text"

          placeholder=
            "Type a message..."

          value={message}

          onChange={(e) => {

            setMessage(
              e.target.value
            )

            // SEND TYPING EVENT
            if (socket && socket.readyState === WebSocket.OPEN) {

              socket.send(

                JSON.stringify({

                  event: "typing",

                  user:
                    localStorage.getItem(
                      "user_name"
                    ) || "User"
                })
              )
            }
          }}

          className="
            flex-1
            border
            rounded-2xl
            px-4
            py-3
            bg-white/70
            outline-none
          "
        />


        <button

          type="submit"

          className="
            px-6
            py-3
            rounded-2xl
            bg-blue-600
            text-white
            font-semibold
            hover:bg-blue-700
            transition
          "
        >

          Send

        </button>

      </form>

    </div>
  )
}

export default ChatPanel