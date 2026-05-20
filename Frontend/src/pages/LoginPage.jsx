import {
  useState,
  useContext
} from "react"

import {
  Link,
  useNavigate
} from "react-router-dom"

import axios from "axios"

import {
  AuthContext
} from "../context/AuthContext"


function LoginPage() {

  const navigate =
    useNavigate()


  const {
    login
  } = useContext(AuthContext)


  const [email, setEmail] =
    useState("")

  const [password,
    setPassword] =
      useState("")

  const [error, setError] =
    useState("")


  // LOGIN
  const handleLogin =
    async (e) => {

      e.preventDefault()

      setError("")


      try {

        const formData =
          new FormData()

        formData.append(
          "username",
          email
        )

        formData.append(
          "password",
          password
        )


        const response =
          await axios.post(

            "http://127.0.0.1:8000/auth/login",

            formData
          )


        // SAVE TOKEN
        login(

          response.data.access_token
        )


        // GO TO DASHBOARD
        navigate("/dashboard")


      } catch (error) {

        console.log(error)

        setError(
          "Invalid credentials"
        )
      }
    }


  return (

    <div className="
      min-h-screen
      flex
      justify-center
      items-center
      bg-linear-to-br
      from-blue-100
      via-indigo-100
      to-slate-200
    ">

      <div className="
        bg-white/70
        backdrop-blur-xl
        rounded-3xl
        shadow-2xl
        p-10
        w-[450px]
      ">

        <h1 className="
          text-5xl
          font-extrabold
          text-blue-700
          text-center
          mb-3
        ">

          SyncSphere

        </h1>


        <p className="
          text-center
          text-gray-600
          mb-10
        ">

          Real-time collaboration platform

        </p>


        <form

          onSubmit={handleLogin}

          className="
            space-y-5
          "
        >

          {/* EMAIL */}
          <input

            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            className="
              w-full
              p-4
              rounded-2xl
              border
              border-gray-200
              outline-none
              focus:ring-2
              focus:ring-blue-400
            "

            required
          />


          {/* PASSWORD */}
          <input

            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            className="
              w-full
              p-4
              rounded-2xl
              border
              border-gray-200
              outline-none
              focus:ring-2
              focus:ring-blue-400
            "

            required
          />


          {/* ERROR */}
          {error && (

            <p className="
              text-red-500
              text-sm
            ">

              {error}

            </p>

          )}


          {/* BUTTON */}
          <button

            type="submit"

            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-4
              rounded-2xl
              text-lg
              font-bold
              shadow-lg
              transition
            "
          >

            Login

          </button>

        </form>


        {/* REGISTER */}
        <p className="
          text-center
          text-gray-600
          mt-8
        ">

          Don’t have an account?

          {" "}

          <Link

            to="/register"

            className="
              text-blue-600
              font-bold
            "
          >

            Register

          </Link>

        </p>

      </div>

    </div>
  )
}

export default LoginPage