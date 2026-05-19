import {
  createContext,
  useState,
  useEffect
} from "react"

import api from "../api/axios"


export const AuthContext =
  createContext()


function AuthProvider({

  children

}) {

  const [token, setToken] =
    useState(

      localStorage.getItem(
        "token"
      ) || null
    )

  const [user, setUser] =
    useState(null)


  // LOGIN
  const login = (newToken) => {

    localStorage.setItem(
      "token",
      newToken
    )

    setToken(newToken)
  }


  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "token"
    )

    setToken(null)

    setUser(null)
  }


  // LOAD USER
  useEffect(() => {

    const loadUser =
      async () => {

        if (!token) return

        try {

          const response =
            await api.get(

              "/auth/me",

              {
                headers: {

                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          setUser(
            response.data
          )
          localStorage.setItem(
  "user_name",
  response.data.name
)

        } catch (error) {

          console.log(error)

          logout()
        }
      }

    loadUser()

  }, [token])


  return (

    <AuthContext.Provider

      value={{

        token,

        user,

        login,

        logout
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}

export default AuthProvider