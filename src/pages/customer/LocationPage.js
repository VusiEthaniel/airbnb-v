import React, { useEffect, useState } from "react"
import { useParams, useSearchParams, Link } from "react-router-dom"
import { useListings } from "../../context/ListingContext"
import { FiStar, FiHeart } from "react-icons/fi"

function LocationPage() {
  const { city } = useParams()
  const [searchParams] = useSearchParams()
  const { listings, loading, error } = useListings()
  const [filteredListings, setFilteredListings] = useState([])
  const [currentCity, setCurrentCity] = useState(city || searchParams.get("city") || "All Locations")
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = ["All", "Entire place", "Private room", "Shared room", "Hotel room"]

  useEffect(() => {
    const filterCity = city || searchParams.get("city")
    setCurrentCity(filterCity || "All Locations")

    if (listings.length > 0) {
      let filtered = listings
      if (filterCity) {
        filtered = listings.filter(
          (listing) => listing.location.toLowerCase() === filterCity.toLowerCase()
        )
      }

      if (activeFilter !== "All") {
        filtered = filtered.filter(
          (listing) => (listing.type || "Entire place") === activeFilter
        )
      }

      setFilteredListings(filtered)
    }
  }, [city, searchParams, listings, activeFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl text-gray-500 animate-pulse">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p className="text-xl mb-2">Error loading properties: {error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1760px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-8">

      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-1">Stays in {currentCity}</h1>
        <p className="text-gray-500 text-sm">
          {filteredListings.length} accommodations available
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${activeFilter === filter 
                ? "bg-rose-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {filteredListings.map((listing) => (
          <Link
            to={`/property/${listing._id}`}
            key={listing._id}
            className="flex flex-col md:flex-row bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden relative"
          >
            <div className="md:w-1/3 relative">
              <img
                src={
                  listing.images && listing.images.length > 0
                    ? listing.images.find((img) => img.trim()) || "/placeholder.svg"
                    : "/placeholder.svg"
                }
                alt={listing.title}
                className="w-full h-64 md:h-full object-cover"
              />
              <button className="absolute top-3 right-3 p-2 text-gray-700 hover:text-rose-500 bg-white rounded-full shadow-md">
                <FiHeart className="text-xl" />
              </button>
            </div>

            <div className="md:w-2/3 p-4 flex flex-col justify-between relative">
              <div>
                <div className="mb-2 text-sm text-gray-500">
                  {listing.type || "Entire place"}
                </div>
                <h2 className="text-lg font-semibold mb-1 line-clamp-1">{listing.title}</h2>
                <p className="text-xs text-gray-400 mb-2">
                  Added by: {listing.addedBy?.name || "Unknown User"}
                </p>
                <div className="text-gray-500 text-sm mb-2 flex flex-wrap gap-2">
                  {listing.amenities?.map((amenity, idx) => (
                    <span key={idx} className="px-2 py-1 border rounded-full text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <FiStar className="mr-1 text-rose-500" />
                  <span className="mr-2">{listing.rating || "New"}</span>
                  <span>• {listing.reviews || 0} reviews</span>
                </div>
                <div className="text-gray-900 font-semibold text-sm">
                  R{listing.price.toLocaleString()} / night
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">No properties found</h2>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationPage
