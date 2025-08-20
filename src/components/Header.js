import React, { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, User, Search } from "lucide-react"
import { useCustomerAuth } from "../context/CustomerAuthContext"
import { useAdminAuth } from "../context/AdminAuthContext"

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")
  const dropdownRef = useRef(null)
  const { user: customerUser, logout: customerLogout } = useCustomerAuth()
  const { adminUser, adminLogout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const currentUser = adminUser || customerUser

  // Hide header on login/signup pages
  const hideHeaderPaths = ["/login", "/signup", "/admin/login", "/admin/signup"]
  if (hideHeaderPaths.includes(location.pathname)) return null

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    if (currentUser?.role === "admin") {
      adminLogout()
      navigate("/admin/login")
    } else {
      customerLogout()
      navigate("/")
    }
    setDropdownOpen(false)
  }

  const handleHostRedirect = () => {
    navigate("/admin/login")
  }

  const handleSearch = () => {
    const query = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      guests,
    }).toString()

    navigate(`/location?${query}`)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img
              src="https://companylogos.org/wp-content/uploads/2024/10/Airbnb-Logo-1-300x169.png"
              alt="Airbnb Logo"
              className="w-[120px] h-auto"
            />
          </Link>
            
          {!adminUser && location.pathname === "/" && (
            <div className="flex-1 max-w-2xl mx-8 hidden md:flex items-center justify-between border border-gray-300 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="px-4 py-2 flex-1">
                <p className="text-xs font-semibold">Where</p>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search destinations"
                  className="w-full text-sm bg-transparent focus:outline-none"
                />
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="px-4 py-2 flex-1">
                <p className="text-xs font-semibold">Check in</p>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-sm bg-transparent text-gray-600 focus:outline-none"
                />
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="px-4 py-2 flex-1">
                <p className="text-xs font-semibold">Check out</p>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-sm bg-transparent text-gray-600 focus:outline-none"
                />
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="px-4 py-2 flex-1">
                <p className="text-xs font-semibold">Who</p>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="Add guests"
                  className="w-full text-sm bg-transparent focus:outline-none"
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  const query = new URLSearchParams({
                    destination,
                    checkIn,
                    checkOut,
                    guests,
                  }).toString()
                  navigate(`/location?${query}`)
                }}
                className="ml-2 bg-red-500 text-white rounded-full p-2 sm:p-3 hover:bg-red-600 transition"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {!currentUser?.role && (
              <button
                onClick={handleHostRedirect}
                className="hidden md:block px-4 py-2 rounded-full hover:bg-gray-100 font-medium"
              >
                Become a Host
              </button>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow"
              >
                <Menu className="w-5 h-5" />
                <User className="w-5 h-5" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser.username || currentUser.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {currentUser.role === "admin"
                            ? "Administrator"
                            : "Customer"}
                        </p>
                      </div>

                      {currentUser.role === "customer" && (
                        <>
                          <Link
                            to="/trips"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                          >
                            <span>Trips</span>
                          </Link>
                          <Link
                            to="/wishlists"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                          >
                            <span>Wishlists</span>
                          </Link>
                        </>
                      )}

                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate("/login")
                          setDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                      >
                        Log in
                      </button>

                      <Link
                        to="/signup"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Sign up
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleHostRedirect}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Host your home
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
