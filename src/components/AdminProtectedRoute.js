import { Navigate, Outlet } from "react-router-dom"
import { useAdminAuth } from "../context/AdminAuthContext"

const AdminProtectedRoute = ({ children }) => {
  const { adminUser, adminLoading } = useAdminAuth()

  if (adminLoading) return <div>Loading...</div>
  if (!adminUser || adminUser.role !== "admin") return <Navigate to="/admin/login" replace />

  return children ? children : <Outlet />
}

export default AdminProtectedRoute
