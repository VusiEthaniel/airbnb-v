import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("Decoded JWT:", decoded)

      const userId = decoded.id || decoded.userId
      if (!userId) {
        return res.status(401).json({ message: "Invalid token payload" })
      }

      // Find user
      const user = await User.findById(userId).select("-password")
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" })
      }

      // Attach user to request
      req.user = user
      next()
    } catch (error) {
      console.error("JWT verification failed:", error.message)
      return res.status(401).json({ message: "Not authorized, token failed" })
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" })
  }
})

export { protect }
