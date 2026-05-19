import {
  useEffect,
  useState,
  useContext
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  createComment,
  getComments
} from "../api/commentApi"


function CommentPanel({

  task,
  socket

}) {

  const {
    token
  } = useContext(AuthContext)

  const [comments, setComments] =
    useState([])

  const [content, setContent] =
    useState("")


  // FETCH COMMENTS
  const fetchComments =
    async () => {

      try {

        const data =
          await getComments(
            token,
            task.id
          )

        setComments(data)

      } catch (error) {

        console.log(error)
      }
    }


  useEffect(() => {

    fetchComments()

  }, [])


  // SOCKET COMMENT EVENTS
  useEffect(() => {

    if (!socket) return

    socket.onmessage = (event) => {

      const data = JSON.parse(
        event.data
      )

      if (
        data.event ===
        "comment_created"
      ) {

        if (
          data.comment.task_id ===
          task.id
        ) {

          setComments((prev) => [

            ...prev,

            data.comment
          ])
        }
      }
    }

  }, [socket])


  // CREATE COMMENT
  const handleCreateComment =
    async () => {

      if (!content) return

      try {

        await createComment(

          token,

          {
            content,
            task_id: task.id
          }
        )

        setContent("")

      } catch (error) {

        console.log(error)
      }
    }


  return (

    <div className="
      bg-white
      rounded-2xl
      shadow-lg
      p-5
      mt-4
    ">

      <h2 className="
        text-xl
        font-bold
        mb-4
      ">

        Comments

      </h2>


      {/* COMMENTS */}
      <div className="
        space-y-3
        max-h-[300px]
        overflow-y-auto
      ">

        {comments.map((comment) => (

          <div
            key={comment.id}
            className="
              bg-gray-100
              p-3
              rounded-xl
            "
          >

            <p className="text-gray-800">

              {comment.content}

            </p>

          </div>

        ))}

      </div>


      {/* INPUT */}
      <div className="
        flex
        gap-3
        mt-5
      ">

        <input
          type="text"

          value={content}

          onChange={(e) =>
            setContent(
              e.target.value
            )
          }

          placeholder="Write comment..."

          className="
            flex-1
            border
            p-3
            rounded-xl
          "
        />

        <button
          onClick={
            handleCreateComment
          }
          className="
            bg-blue-600
            text-white
            px-5
            rounded-xl
          "
        >
          Send
        </button>

      </div>

    </div>
  )
}

export default CommentPanel