import {
  createContext,
  useEffect,
  useState
} from "react"

import axios from "axios"


export const AuthContext =
  createContext()


function AuthProvider({

  children

}) {

  const [token, setToken] =
    useState(

      localStorage.getItem(
        "token"
      ) || ""
    )

  const [user, setUser] =
    useState(null)


  // LOAD USER
  const loadUser =
    async () => {

      if (!token) return

      try {

        const response =
          await axios.get(

            "http://127.0.0.1:8000/auth/me",

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

      } catch (error) {

        console.log(error)

        logout()
      }
    }


  useEffect(() => {

    loadUser()

  }, [token])


  // LOGIN
  const login = (

    newToken

  ) => {

    localStorage.setItem(

      "token",

      newToken
    )

    setToken(
      newToken
    )
  }


  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "token"
    )

    setToken("")

    setUser(null)
  }


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


export default AuthProvider``