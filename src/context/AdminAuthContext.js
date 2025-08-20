import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);
  const navigate = useNavigate();

  // Load admin from localStorage
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAdminUser({ ...parsedUser, token });
      } catch (err) {
        console.error("Failed to parse admin user data:", err);
        adminLogout();
      }
    }
    setAdminLoading(false);
  }, []);

  // Admin login
  const adminLogin = async (email, password) => {
    setAdminError(null);
    setAdminLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/admin/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, userId, username, email: userEmail, role } = response.data;

      if (token && userId && role === "admin") {
        const user = { id: userId, username, email: userEmail, role, token };
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));
        setAdminUser(user);
        navigate("/admin/dashboard"); 
      } else {
        setAdminError("Invalid admin credentials");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      setAdminError(msg);
    } finally {
      setAdminLoading(false);
    }
  };

  // Admin signup
  const adminSignup = async (username, email, password) => {
    setAdminError(null);
    setAdminLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/admin/signup",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201 || response.status === 200) {
        return { success: true, message: response.data.message };
      } else {
        setAdminError(response.data.message || "Signup failed");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Signup failed";
      setAdminError(msg);
    } finally {
      setAdminLoading(false);
    }
  };

  // Admin logout
  const adminLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
    navigate("/admin/login");
  }, [navigate]);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminLoading,
        adminError,
        adminLogin,
        adminSignup,
        adminLogout,
        setAdminError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
