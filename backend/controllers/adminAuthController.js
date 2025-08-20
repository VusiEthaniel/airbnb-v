import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Admin Signup
export const adminSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const emailLower = email.trim().toLowerCase();

    const exists = await User.findOne({ email: emailLower });
    if (exists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Explicitly set role to admin
    const newAdmin = await User.create({
      username,
      email: emailLower,
      password, // schema will hash it
      role: "admin",
    });

    const token = generateToken(newAdmin._id, "admin");

    res.status(201).json({
      token,
      userId: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      role: newAdmin.role,
      message: "Admin account created successfully",
    });
  } catch (err) {
    console.error("Admin signup error:", err.message, err);
    res.status(500).json({ message: "Server error during signup", error: err.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const emailLower = email.trim().toLowerCase();

    // Only find admin
    const admin = await User.findOne({ email: emailLower, role: "admin" }).select("+password");
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(admin._id, "admin");

    res.status(200).json({
      token,
      userId: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Admin login error:", err.message, err);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};
