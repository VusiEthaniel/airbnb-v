import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"
import bcrypt from "bcryptjs"

const saltRounds = 10

// Customer Login
export const customerLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    const customer = await User.findOne({ email, role: "customer" }).select("+password")
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(password, customer.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = generateToken(customer._id, customer.role)

    res.status(200).json({
      token,
      userId: customer._id,
      username: customer.username,
      email: customer.email,
      role: customer.role,
      message: "Login successful",
    })
  } catch (err) {
    console.error("Customer login error:", err)
    res.status(500).json({ message: "Server error during login" })
  }
}

// Customer Signup
export const customerSignup = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existingCustomer = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingCustomer) {
      return res.status(400).json({ message: "User with email or username already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newCustomer = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "customer",
    })

    const token = generateToken(newCustomer._id, newCustomer.role)

    res.status(201).json({
      message: "Customer account created successfully",
      token,
      userId: newCustomer._id,
      username: newCustomer.username,
      email: newCustomer.email,
      role: newCustomer.role,
    })
  } catch (err) {
    console.error("Customer signup error:", err)
    res.status(500).json({ message: "Server error during signup" })
  }
}
