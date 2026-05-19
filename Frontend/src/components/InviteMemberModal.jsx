
import {
  useState
} from "react"


function InviteMemberModal({

  onClose,
  onInvite

}) {

  const [email, setEmail] =
    useState("")


  const handleSubmit = (e) => {

    e.preventDefault()

    onInvite({
      email
    })
  }


  return (

    <div className="
      fixed
      inset-0
      bg-black/50
      flex
      justify-center
      items-center
      z-50
    ">

      <div className="
        bg-white
        p-8
        rounded-3xl
        w-[400px]
        shadow-2xl
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-6
        ">

          Invite Member

        </h2>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input

            type="email"

            placeholder="User Email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            className="
              w-full
              border
              p-3
              rounded-xl
            "

            required
          />


          <div className="
            flex
            justify-end
            gap-3
          ">

            <button

              type="button"

              onClick={onClose}

              className="
                px-4
                py-2
                rounded-xl
                bg-gray-300
              "
            >

              Cancel

            </button>


            <button

              type="submit"

              className="
                px-5
                py-2
                rounded-xl
                bg-blue-600
                text-white
              "
            >

              Invite

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default InviteMemberModal