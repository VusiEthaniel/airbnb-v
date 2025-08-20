import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const CustomerAuthContext = createContext()

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser({ ...parsedUser, token })
        console.log("Loaded user from localStorage:", parsedUser)
      } catch (err) {
        console.error("Invalid user data in localStorage:", err)
        logout()
      }
    }
    setLoading(false)
  }, [])

  // LOGIN
  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    try {
      if (!email || !password) throw new Error("Email and password are required")

      const { data } = await axios.post(
        "http://localhost:4000/api/users/login",
        { email: email.trim(), password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      )

      if (!data.success || !data.token || !data.user) {
        throw new Error(data.message || "Login failed")
      }

      // Save to localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setUser({ ...data.user, token: data.token })
      console.log("Logged in user:", { ...data.user, token: data.token })

      navigate("/")
      return { success: true, user: { ...data.user, token: data.token } }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An unexpected error occurred"
      setError(msg)
      console.error("Login error:", msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  // SIGNUP
  const signup = async (username, email, password) => {
    setError(null)
    setLoading(true)
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/users/signup",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      )

      if (!data.success) throw new Error(data.message || "Signup failed")

      console.log("Signup successful:", data.message)
      return { success: true, message: data.message }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An unexpected error occurred"
      setError(msg)
      console.error("Signup error:", msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      await axios.post("http://localhost:4000/api/users/logout", {}, { withCredentials: true })
    } catch (err) {
      console.warn("Logout request failed:", err.message)
    }

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
    console.log("User logged out")
  }, [navigate])

  return (
    <CustomerAuthContext.Provider value={{ user, loading, error, login, signup, logout, setError }}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext)
}
