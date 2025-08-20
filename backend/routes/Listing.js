import express from "express"
import Listing from "../models/Listing.js"
import { protect } from "../middleware/authMiddleware.js"
import { verifyAdminToken } from "../middleware/verifyAdminToken.js"

const router = express.Router()

const ListingController = {
  // Create listing (admin only)
  createListing: async (req, res) => {
    try {
      const requiredFields = ["title", "description", "price", "location", "guests", "bedrooms", "bathrooms"]
      const missingFields = requiredFields.filter((field) => !req.body[field])

      if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
        missingFields.push("images")
      }

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        })
      }

      const listingData = {
        ...req.body,
        host: req.user._id,
      }

      const newListing = await Listing.create(listingData)

      res.status(201).json({
        success: true,
        data: newListing,
      })
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message)
        return res.status(400).json({
          success: false,
          message: `Validation Error: ${messages.join(", ")}`,
        })
      }
      console.error("Error creating listing:", error)
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create listing",
      })
    }
  },

  // Get all listings
  getListings: async (req, res) => {
    try {
      const listings = await Listing.find().populate("host", "username email role")
      res.status(200).json({
        success: true,
        count: listings.length,
        data: listings,
      })
    } catch (error) {
      console.error("Error fetching listings:", error)
      res.status(500).json({
        success: false,
        message: "Failed to fetch listings",
      })
    }
  },

  // Get listing by ID
  getListingById: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id).populate("host", "username email role")
      if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" })
      }
      res.status(200).json({ success: true, data: listing })
    } catch (error) {
      console.error("Error fetching listing:", error)
      res.status(500).json({ success: false, message: "Failed to fetch listing" })
    }
  },

  // Update listing
  updateListing: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id)
      if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" })
      }

      // Only host or admin can update
      const isAdmin = req.user.role === "admin"
      if (listing.host.toString() !== req.user._id.toString() && !isAdmin) {
        return res.status(403).json({ success: false, message: "Not authorized to update this listing" })
      }

      const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })

      res.status(200).json({ success: true, data: updatedListing })
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message)
        return res.status(400).json({
          success: false,
          message: `Validation Error: ${messages.join(", ")}`,
        })
      }
      console.error("Error updating listing:", error)
      res.status(500).json({ success: false, message: "Failed to update listing" })
    }
  },

  // Delete listing
  deleteListing: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id)
      if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" })
      }

      const isAdmin = req.user.role === "admin"
      if (listing.host.toString() !== req.user._id.toString() && !isAdmin) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this listing" })
      }

      await Listing.findByIdAndDelete(req.params.id)

      res.status(200).json({ success: true, data: {} })
    } catch (error) {
      console.error("Error deleting listing:", error)
      res.status(500).json({ success: false, message: "Failed to delete listing" })
    }
  },
}

// Public routes
router.get("/", ListingController.getListings)
router.get("/:id", ListingController.getListingById)

// Protected admin routes
router.post("/", protect, verifyAdminToken, ListingController.createListing)
router.put("/:id", protect, verifyAdminToken, ListingController.updateListing)
router.delete("/:id", protect, verifyAdminToken, ListingController.deleteListing)

export default router
