import { useState, useContext } from "react"

import api from "../api/axios"

import { AuthContext } from "../context/AuthContext"

import { useNavigate } from "react-router-dom"


function LoginPage() {

  const navigate = useNavigate()

  const { login } = useContext(AuthContext)

  const [formData, setFormData] = useState({

    username: "",
    password: ""
  })

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const response = await api.post(

        "/auth/login",

        new URLSearchParams({

          username: formData.username,
          password: formData.password
        }),

        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          }
        }
      )

      const token =
        response.data.access_token

      login(token)

      navigate("/")

    } catch (error) {

      console.log(error)

      alert("Login Failed")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          name="username"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Login
        </button>

      </form>

    </div>
  )
}

export default LoginPage