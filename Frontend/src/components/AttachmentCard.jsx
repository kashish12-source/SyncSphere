function AttachmentCard({

  attachment

}) {

  const isImage =

    attachment.filename
      .match(
        /\.(jpg|jpeg|png|gif|webp)$/i
      )


  return (

    <div className="
      bg-white/70
      backdrop-blur-lg
      rounded-2xl
      p-4
      shadow-md
      border
      border-white/20
    ">

      {/* IMAGE */}
      {isImage && (

        <img

          src={`http://127.0.0.1:8000${attachment.file_url}`}

          alt="attachment"

          className="
            w-full
            h-48
            object-cover
            rounded-xl
            mb-4
          "
        />

      )}


      {/* FILE INFO */}
      <div className="
        flex
        items-center
        justify-between
      ">

        <div>

          <h3 className="
            font-semibold
            text-gray-800
            break-all
          ">

            {attachment.filename}

          </h3>

        </div>


        <a

          href={`http://127.0.0.1:8000${attachment.file_url}`}

          target="_blank"

          rel="noreferrer"

          className="
            px-4
            py-2
            rounded-xl
            bg-blue-600
            text-white
            text-sm
            font-semibold
          "
        >

          Open

        </a>

      </div>

    </div>
  )
}

export default AttachmentCard