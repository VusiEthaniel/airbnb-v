"use client"
import React, { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useCustomerAuth } from "../../context/CustomerAuthContext"

const CustomerLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, setError } = useCustomerAuth()

  // Get the page user came from, default to homepage
  const from = location.state?.from || "/"

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(formData.email, formData.password)
      // Redirect back to the original page
      navigate(from, { replace: true })
    } catch (err) {
      console.error("Customer login failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full flex justify-start p-6">
        <Link to="/">
          <img src="/Airbnb_Logo_Bélo.svg.png" alt="Airbnb Logo" className="h-10 cursor-pointer" />
        </Link>
      </div>

      <div className="w-full max-w-md mt-10 px-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Customer Login</h2>

        {error && (
          <p className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={`mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
              isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting || loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default CustomerLogin
