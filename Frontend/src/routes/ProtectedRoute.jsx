import {
  useContext
} from "react"

import {
  Navigate
} from "react-router-dom"

import {
  AuthContext
} from "../context/AuthContext"


function ProtectedRoute({ children }) {

  const {
    token,
    loading
  } = useContext(AuthContext)

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-2xl font-bold">
          Loading...
        </h1>

      </div>
    )
  }

  if (!token) {

    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute