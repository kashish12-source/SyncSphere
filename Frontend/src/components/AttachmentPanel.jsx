import {
  useEffect,
  useState,
  useContext
} from "react"

import {
  AuthContext
} from "../context/AuthContext"

import {
  uploadAttachment,
  getAttachments
} from "../api/attachmentApi"

import AttachmentCard from "./AttachmentCard.jsx"


function AttachmentsPanel({

  taskId

}) {

  const {
    token
  } = useContext(AuthContext)


  const [attachments, setAttachments] =
    useState([])

  const [uploading, setUploading] =
    useState(false)


  // FETCH FILES
  const fetchAttachments =
    async () => {

      try {

        const data =
          await getAttachments(

            token,

            taskId
          )

        setAttachments(data)

      } catch (error) {

        console.log(error)
      }
    }


  // INITIAL LOAD
  useEffect(() => {

    fetchAttachments()

  }, [])


  // UPLOAD
  const handleUpload =
    async (e) => {

      const file =
        e.target.files[0]

      if (!file) return


      try {

        setUploading(true)

        await uploadAttachment(

          token,

          taskId,

          file
        )

        fetchAttachments()

      } catch (error) {

        console.log(error)

      } finally {

        setUploading(false)
      }
    }


  return (

    <div className="
      bg-white/40
      backdrop-blur-lg
      border border-white/20
      rounded-3xl
      p-5
      shadow-xl
    ">

      {/* HEADER */}
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

          Attachments

        </h2>


        <label className="
          px-4
          py-2
          rounded-xl
          bg-blue-600
          text-white
          cursor-pointer
          text-sm
          font-semibold
        ">

          {uploading
            ? "Uploading..."
            : "Upload"}

          <input

            type="file"

            hidden

            onChange={
              handleUpload
            }
          />

        </label>

      </div>


      {/* FILES */}
      <div className="
        space-y-4
      ">

        {attachments.map((attachment) => (

          <AttachmentCard

            key={attachment.id}

            attachment={attachment}

          />

        ))}

      </div>

    </div>
  )
}

export default AttachmentsPanel