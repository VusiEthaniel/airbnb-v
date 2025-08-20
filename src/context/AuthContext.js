import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (err) {
        console.error("Failed to parse user data:", err)
        logout()
      }
    }

    setLoading(false)
  }, [])

  // Login handler
  const login = async (email, password) => {
    setError(null)
    setLoading(true)

    try {
      if (!email || !password) throw new Error("Email and password are required")

      const response = await axios.post(
        "http://localhost:4000/api/customer/login",
        { email: email.trim(), password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      )

      const { success, token, user, message } = response.data

      if (success && token && user) {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
        navigate("/customer/dashboard")
      } else {
        throw new Error(message || "Login failed")
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An unexpected error occurred"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await axios.post("http://localhost:4000/api/customer/logout", {}, { withCredentials: true })
    } catch (err) {
      console.error("Logout error:", err.message)
    }

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }, [navigate])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, setError }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
