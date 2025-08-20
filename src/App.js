import React from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ListingProvider } from "./context/ListingContext"
import { BookingProvider } from "./context/BookingContext"
import Header from "./components/Header"

// Customer pages
import HomePage from "./pages/customer/HomePage"
import LocationPage from "./pages/customer/LocationPage"
import PropertyDetails from "./pages/customer/PropertyDetails"
import CustomerLogin from "./pages/customer/CustomerLogin"
import CustomerSignup from "./pages/customer/CustomerSignup"
import BookingConfirmation from "./pages/customer/BookingConfirmation"

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin"
import AdminSignup from "./pages/admin/AdminSignup"
import AdminDashboard from "./pages/admin/AdminDashboard"
import CreateListing from "./pages/admin/CreateListing"
import ViewListings from "./pages/admin/ViewListings"
import UpdateListing from "./pages/admin/UpdateListing"

function AppContent() {
  const location = useLocation()

  const hideHeaderRoutes = [
    "/login",
    "/signup",
    "/admin/login",
    "/admin/signup",
  ]

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/location/:city" element={<LocationPage />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />

        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/signup" element={<CustomerSignup />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/listings/create" element={<CreateListing />} />
        <Route path="/admin/listings" element={<ViewListings />} />
        <Route path="/admin/listings/edit/:id" element={<UpdateListing />} />

        <Route path="/become-host" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <ListingProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </ListingProvider>
  )
}

export default App
