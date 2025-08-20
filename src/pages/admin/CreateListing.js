"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListings } from "../../context/ListingContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

function CreateListing() {
  const { addListing, error: listingError, setError: setListingError } = useListings();
  const { adminUser } = useAdminAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: ["", "", "", "", ""],
    amenities: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
    type: "house",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
    setListingError(null);
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
    setMessage("");
    setListingError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setListingError(null);
    setLoading(true);

    if (!adminUser?.token) {
      setMessage("Authentication required. Please log in as admin.");
      setLoading(false);
      return;
    }

    if (formData.images.some((img) => !img.trim())) {
      setMessage("Please provide all 5 image URLs.");
      setLoading(false);
      return;
    }

    const listingData = {
      ...formData,
      price: Number(formData.price),
      guests: Number(formData.guests),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      amenities: formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    try {
      const result = await addListing(listingData, adminUser.token);

      if (result.success) {
        setMessage("Listing created successfully!");
        setFormData({
          title: "",
          description: "",
          price: "",
          location: "",
          images: ["", "", "", "", ""],
          amenities: "",
          guests: "",
          bedrooms: "",
          bathrooms: "",
          type: "house",
        });
        setTimeout(() => navigate("/admin/listings"), 1500);
      } else {
        setMessage(result.error || "Failed to create listing.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Listing</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Price per night</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.images.map((img, index) => (
            <div key={index}>
              <label>Image {index + 1} URL</label>
              <input
                type="url"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          ))}
        </div>

        <div>
          <label>Amenities (comma-separated)</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>Max Guests</label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label>Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label>Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div>
          <label>Property Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="villa">Villa</option>
            <option value="cabin">Cabin</option>
            <option value="other">Other</option>
          </select>
        </div>

        {(message || listingError) && (
          <p
            className={`text-center font-medium ${
              listingError ? "text-red-600" : "text-green-600"
            }`}
          >
            {listingError || message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Listing..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;
