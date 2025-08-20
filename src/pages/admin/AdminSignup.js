import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminSignup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { adminSignup, adminLoading, adminError, setAdminError } = useAdminAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const errors = {};
    let valid = true;

    if (!username.trim()) { errors.username = "Username is required"; valid = false; }
    if (!email.trim()) { errors.email = "Email is required"; valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { errors.email = "Invalid email format"; valid = false; }
    if (!password) { errors.password = "Password is required"; valid = false; }
    else if (password.length < 6) { errors.password = "Password must be at least 6 characters"; valid = false; }

    setFormErrors(errors);
    return valid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAdminError(null);
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      const result = await adminSignup(username.trim(), email.trim(), password);
      if (result.success) {
        setSuccessMessage(result.message || "Registration successful! Redirecting...");
        setTimeout(() => navigate("/admin/login"), 1500);
      }
    } catch (err) {
      setAdminError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full flex justify-start p-6">
        <Link to="/">
          <img src="/Airbnb_Logo_Bélo.svg.png" alt="Airbnb Logo" className="h-10 cursor-pointer" />
        </Link>
      </div>

      <div className="w-full max-w-md mt-10 px-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Register</h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setFormErrors((p) => ({ ...p, username: "" })); setAdminError(null); }}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {formErrors.username && <p className="mt-1 text-xs text-red-600">{formErrors.username}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFormErrors((p) => ({ ...p, email: "" })); setAdminError(null); }}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFormErrors((p) => ({ ...p, password: "" })); setAdminError(null); }}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {formErrors.password && <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={adminLoading}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adminLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {(successMessage || adminError) && (
          <p className={`mt-4 text-center font-medium ${adminError ? "text-red-600" : "text-green-600"}`}>
            {adminError || successMessage}
          </p>
        )}

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/admin/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
