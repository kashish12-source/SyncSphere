import {
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import LoginPage from "../pages/LoginPage.jsx"

import RegisterPage from "../pages/RegisterPage.jsx"

import DashboardPage from "../pages/DashboardPage.jsx"

import WorkspacePage from "../pages/WorkspacePage.jsx"

import PrivateRoute from "./ProtectedRoute.jsx"


function AppRoutes() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route

        path="/login"

        element={<LoginPage />}

      />


      {/* REGISTER */}
      <Route

        path="/register"

        element={<RegisterPage />}

      />


      {/* DASHBOARD */}
      <Route

        path="/dashboard"

        element={

          <PrivateRoute>

            <DashboardPage />

          </PrivateRoute>
        }

      />


      {/* WORKSPACE */}
      <Route

        path="/workspace/:workspaceId"

        element={

          <PrivateRoute>

            <WorkspacePage />

          </PrivateRoute>
        }

      />


      {/* DEFAULT */}
      <Route

        path="*"

        element={
          <Navigate to="/login" />
        }

      />

    </Routes>
  )
}

export default AppRoutes