import asyncHandler from "express-async-handler"
import Booking from "../models/Booking.js"
import Listing from "../models/Listing.js"

// Create a new booking
const createBooking = asyncHandler(async (req, res) => {
  const { listingId, startDate, endDate, guests, totalPrice } = req.body

  if (!listingId || !startDate || !endDate || !guests || !totalPrice) {
    return res.status(400).json({ success: false, message: "Missing booking data" })
  }

  const listing = await Listing.findById(listingId)
  if (!listing) return res.status(404).json({ success: false, message: "Listing not found" })

  const booking = await Booking.create({
    listing: listingId,
    user: req.user._id,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    guests,
    totalPrice,
  })

  res.status(201).json({ success: true, booking })
})

// Get all bookings for logged-in user
const getBookingsByUser = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing")
  res.status(200).json({ success: true, bookings })
})

//Get single booking by ID
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("listing")
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found" })
  if (booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" })
  }
  res.status(200).json({ success: true, booking })
})

export { createBooking, getBookingsByUser, getBookingById }
