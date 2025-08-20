import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useListings } from "../../context/ListingContext"
import { useAdminAuth } from "../../context/AdminAuthContext"
import axios from "axios"

function UpdateListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateListing } = useListings()
  const { adminUser } = useAdminAuth()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    city: "",
    country: "",
    image: "",
    images: [],
    amenities: [],
    type: "",
    bedrooms: "",
    bathrooms: "",
    guests: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`http://localhost:4000/api/listings/${id}`)
        const listing = data.data

        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          location: listing.location,
          city: listing.city || "",
          country: listing.country || "",
          image: listing.image || "",
          images: listing.images || [listing.image || ""],
          amenities: listing.amenities || [],
          type: listing.type,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          guests: listing.guests,
        })
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch listing details.")
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((amenity) => amenity !== value),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }))
    }
  }

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }))
  }

  const addImageField = () => {
    if (formData.images.length < 5) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ""],
      }))
    }
  }

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        images: newImages,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!adminUser || !adminUser.token) {
      setError("Authentication required. Please log in as admin.")
      return
    }

    const filteredImages = formData.images.filter((img) => img.trim() !== "")
    if (filteredImages.length === 0) {
      setError("At least one image URL is required.")
      return
    }

    try {
      const result = await updateListing(
        id,
        { ...formData, images: filteredImages, image: filteredImages[0] },
        adminUser.token
      )

      if (result.success) {
        setMessage("Listing updated successfully!")
        setTimeout(() => navigate("/admin/listings"), 1500)
      } else {
        setError(result.error || "Failed to update listing.")
      }
    } catch (err) {
      setError("An unexpected error occurred during listing update.")
      console.error("Update listing submission error:", err)
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading listing for edit...</div>
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-700">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Listing</h1>
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price per night (R)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            min="0"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location (Street/Area)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URLs (Up to 5)
          </label>
          {formData.images.map((imageUrl, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`Image URL ${index + 1}`}
                className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                required={index === 0}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {formData.images.length < 5 && (
            <button
              type="button"
              onClick={addImageField}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2"
            >
              Add Another Image
            </button>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Property Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="Entire home">Entire home</option>
            <option value="Private room">Private room</option>
            <option value="Shared room">Shared room</option>
            <option value="Entire apartment">Entire apartment</option>
            <option value="Entire villa">Entire villa</option>
            <option value="Entire cabin">Entire cabin</option>
            <option value="Entire condo">Entire condo</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
              Max Guests
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              "Wifi",
              "Kitchen",
              "Air conditioning",
              "Heating",
              "Washer",
              "Dryer",
              "Free parking",
              "TV",
              "Pool",
              "Hot tub",
              "Gym",
              "Beach access",
              "Fireplace",
              "Pet-friendly",
            ].map((amenity) => (
              <div key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  id={amenity}
                  name="amenities"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded"
                />
                <label htmlFor={amenity} className="ml-2 text-sm text-gray-700">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition duration-200"
        >
          Update Listing
        </button>
      </form>
    </div>
  )
}

export default UpdateListing
