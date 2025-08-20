import React from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useCustomerAuth } from "../context/CustomerAuthContext"

const ProtectedRoute = () => {
  const { user, loading } = useCustomerAuth()
  const location = useLocation()

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  // If user is logged in, render nested routes
  if (user) return <Outlet />

  return <Navigate to="/login" state={{ from: location.pathname }} replace />
}

export default ProtectedRoute
