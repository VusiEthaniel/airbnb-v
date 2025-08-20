import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

function BookingConfirmation() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/bookings/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        )
        if (data.success) setBooking(data.booking)
        else setError(data.message || "Booking not found")
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching booking")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading booking details...</div>

  if (error || !booking)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Booking Details Not Found</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            to="/"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )

  const { listing } = booking

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Booking Confirmed!</h1>
        <p className="text-center text-gray-700 mb-8">
          Your reservation for <span className="font-semibold">{listing.title}</span> has been successfully confirmed.
        </p>

        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-3">Property Details</h2>
              <p className="text-gray-700"><strong>Location:</strong> {listing.location}</p>
              <p className="text-gray-700"><strong>Price per night:</strong> R{listing.price}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Booking Details</h2>
              <p className="text-gray-700"><strong>Booking ID:</strong> {booking._id}</p>
              <p className="text-gray-700"><strong>Check-in:</strong> {formatDate(booking.startDate)}</p>
              <p className="text-gray-700"><strong>Check-out:</strong> {formatDate(booking.endDate)}</p>
              <p className="text-gray-700"><strong>Guests:</strong> {booking.guests}</p>
              <p className="text-gray-700"><strong>Total Price:</strong> R{booking.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Thank you for choosing our service. We look forward to your stay!</p>
          <Link
            to="/"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
