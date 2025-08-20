import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

const validateAuthInput = (type) => (req, res, next) => {
  const { email, password, username } = req.body

  if (!email?.trim()) return res.status(400).json({ success: false, message: "Valid email is required" })
  if (!password || password.length < 6)
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" })
  if (type === "signup" && !username?.trim())
    return res.status(400).json({ success: false, message: "Username is required" })

  next()
}

// Signup
router.post("/signup", validateAuthInput("signup"), async (req, res) => {
  try {
    const { email, password, username } = req.body
    const sanitizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({ email: sanitizedEmail })
    if (existingUser) return res.status(409).json({ success: false, message: "User already exists" })

    const user = new User({ email: sanitizedEmail, password, username: username.trim(), role: "customer" })
    await user.save()

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    })

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 })

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, username: user.username, role: user.role },
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ success: false, message: "Registration failed", ...(process.env.NODE_ENV === "development" && { error: error.message }) })
  }
})

// Login
router.post("/login", validateAuthInput("login"), async (req, res) => {
  try {
    const { email, password } = req.body
    const sanitizedEmail = email.trim().toLowerCase()

    const user = await User.findOne({ email: sanitizedEmail, role: "customer" }).select("+password +loginAttempts +lockUntil")
    console.log("Login attempt:", sanitizedEmail, "User found:", !!user)

    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" })

    // Account lock
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const retryAfter = Math.ceil((user.lockUntil - Date.now()) / 1000)
      return res.status(429).json({ success: false, message: `Account locked. Try again in ${retryAfter}s`, retryAfter })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      const updates = { $inc: { loginAttempts: 1 } }
      if (user.loginAttempts + 1 >= 5) updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 }
      await User.findByIdAndUpdate(user._id, updates)
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Reset login attempts
    if (user.loginAttempts > 0 || user.lockUntil) await User.findByIdAndUpdate(user._id, { loginAttempts: 0, lockUntil: null })

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    })

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 })

    res.status(200).json({ success: true, token, user: { id: user._id, email: user.email, username: user.username, role: user.role }, message: "Login successful" })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ success: false, message: "Authentication failed", ...(process.env.NODE_ENV === "development" && { error: error.message }) })
  }
})

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" })
  res.status(200).json({ success: true, message: "Logged out successfully" })
})

export default router
