import React, { createContext, useContext, useState } from "react"
import axios from "axios"

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createBooking = async (bookingData) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const { data } = await axios.post("http://localhost:4000/api/bookings", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!data.success || !data.booking) {
        throw new Error(data.message || "Booking failed")
      }

      return { success: true, booking: data.booking }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Booking failed"
      setError(msg)
      console.error("Booking submission error:", err)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  return (
    <BookingContext.Provider value={{ createBooking, loading, error, setError }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBookings = () => useContext(BookingContext)
