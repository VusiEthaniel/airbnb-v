import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { createBooking, getBookingsByUser, getBookingById } from "../controllers/reservationController.js"

const router = express.Router()

router.post("/", protect, createBooking)
router.get("/my", protect, getBookingsByUser)
router.get("/:id", protect, getBookingById) 

export default router
