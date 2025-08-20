import React from "react";
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCustomerAuth } from "../../context/CustomerAuthContext"

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [message, setMessage] = useState("") 
  const navigate = useNavigate()
  const { signup, loading, error, setError } = useCustomerAuth() 

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setMessage("") 
    setError(null)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setMessage("") 
    setError(null)

    try {
      const result = await signup(formData.username, formData.email, formData.password) 
      if (result.success) {
        setMessage(result.message || "Registration successful! Please log in.")
        setTimeout(() => {
          navigate("/login")
        }, 1500) 
      }
    } catch (err) {
      setMessage(err.message || "Registration failed. Please try again.")
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
        <h2 className="text-2xl font-semibold text-center mb-6">Customer Register</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading} 
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {(message || error) && (
          <p className={`mt-4 text-center font-medium ${error ? "text-red-600" : "text-green-600"}`}>
            {error || message}
          </p>
        )}
      </div>
    </div>
  )
}

export default CustomerSignup
