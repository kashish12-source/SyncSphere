import {
  useEffect,
  useState,
  useContext
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  getComments,
  createComment
} from "../api/commentApi"


function CommentsPanel({

  taskId

}) {

  const {
    token
  } = useContext(AuthContext)


  const [comments, setComments] =
    useState([])

  const [comment, setComment] =
    useState("")

  const [loading, setLoading] =
    useState(false)


  // FETCH COMMENTS
  const fetchComments =
    async () => {

      try {

        const data =
          await getComments(

            token,

            taskId
          )

        setComments(data)

      } catch (error) {

        console.log(
          "Comments Error:",
          error
        )
      }
    }


  useEffect(() => {

    if (taskId) {

      fetchComments()
    }

  }, [taskId])


  // ADD COMMENT
  const handleAddComment =
    async (e) => {

      e.preventDefault()

      if (!comment.trim())
        return


      try {

        setLoading(true)

        await createComment(

          token,

          {
            task_id: taskId,

            content: comment
          }
        )

        setComment("")

        await fetchComments()

      } catch (error) {

        console.log(
          "Create Comment Error:",
          error
        )

      } finally {

        setLoading(false)
      }
    }


  return (

    <div className="
      bg-white/50
      backdrop-blur-lg
      border border-white/20
      rounded-2xl
      p-4
      shadow-lg
    ">

      {/* HEADER */}
      <div className="
        flex
        justify-between
        items-center
        mb-4
      ">

        <h2 className="
          text-lg
          font-bold
          text-gray-800
        ">

          Comments

        </h2>


        <span className="
          text-xs
          bg-blue-100
          text-blue-700
          px-2
          py-1
          rounded-full
          font-semibold
        ">

          {comments.length}

        </span>

      </div>


      {/* COMMENTS LIST */}
      <div className="
        space-y-3
        max-h-52
        overflow-y-auto
        mb-4
        pr-1
      ">

        {comments.length === 0 && (

          <p className="
            text-sm
            text-gray-500
          ">

            No comments yet

          </p>

        )}


        {comments.map((item) => (

          <div

            key={item.id}

            className="
              bg-white/80
              rounded-xl
              p-3
              border
              border-gray-100
            "
          >

            <p className="
              text-sm
              text-gray-700
              wrap-break-words
            ">

              {item.content}

            </p>

          </div>

        ))}

      </div>


      {/* INPUT */}
      <form

        onSubmit={
          handleAddComment
        }

        className="
          flex
          items-center
          gap-2
        "
      >

        <input

          type="text"

          placeholder=
            "Write comment..."

          value={comment}

          onChange={(e) =>
            setComment(
              e.target.value
            )
          }

          className="
            flex-1
            min-w-0
            border
            border-gray-300
            rounded-xl
            px-3
            py-2
            bg-white/80
            outline-none
            focus:ring-2
            focus:ring-blue-400
          "
        />


        <button

          type="submit"

          disabled={loading}

          className="
            px-4
            py-2
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            transition
            whitespace-nowrap
          "
        >

          {loading
            ? "..."
            : "Send"}

        </button>

      </form>

    </div>
  )
}

export default CommentsPanel