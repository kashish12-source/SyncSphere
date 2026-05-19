import { useState } from "react"

import api from "../api/axios"

import { useNavigate } from "react-router-dom"


function RegisterPage() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({

    name: "",
    email: "",
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

      await api.post(
        "/auth/register",
        formData
      )

      alert("Registration Successful")

      navigate("/login")

    } catch (error) {

      console.log(error)

      alert("Registration Failed")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="email"
          name="email"
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
          Register
        </button>

      </form>

    </div>
  )
}

export default RegisterPage