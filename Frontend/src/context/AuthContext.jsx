import {
  createContext,
  useState,
  useEffect
} from "react"

import api from "../api/axios"


export const AuthContext = createContext()


function AuthProvider({ children }) {

  const [token, setToken] = useState(

    localStorage.getItem("token")
  )

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)


  // FETCH CURRENT USER
  const fetchCurrentUser = async () => {

    if (!token) {

      setLoading(false)

      return
    }

    try {

      const response = await api.get(
        "/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setUser(response.data)

    } catch (error) {

      console.log(error)

      logout()
    }

    setLoading(false)
  }


  useEffect(() => {

    fetchCurrentUser()

  }, [token])


  const login = (jwtToken) => {

    localStorage.setItem(
      "token",
      jwtToken
    )

    setToken(jwtToken)
  }


  const logout = () => {

    localStorage.removeItem("token")

    setToken(null)

    setUser(null)
  }


  return (

    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}

export default AuthProvider