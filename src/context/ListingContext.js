import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ListingContext = createContext();

export const ListingProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to clean strings
  const cleanString = (str) => str?.replace(/[\u2028\u2029]/g, "").trim() || "";

  // Fetch all listings on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/api/listings");
        setListings(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Failed to fetch listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Helper to validate payload before sending to backend
  const validatePayload = (payload) => {
    const requiredFields = [
      "title",
      "description",
      "price",
      "location",
      "images",
      "guests",
      "bedrooms",
      "bathrooms",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        payload[field] === undefined ||
        payload[field] === null ||
        (typeof payload[field] === "string" && payload[field].trim() === "") ||
        (Array.isArray(payload[field]) && payload[field].length === 0)
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (payload.images.length > 5) {
      throw new Error("Maximum of 5 images allowed.");
    }
  };

  // Add a new listing
  const addListing = async (listingData, token) => {
    try {
      const payload = {
        title: cleanString(listingData.title),
        description: cleanString(listingData.description),
        location: cleanString(listingData.location),
        type: cleanString(listingData.type) || "house",
        amenities: (listingData.amenities || []).map(cleanString),
        price: Number(listingData.price),
        guests: Number(listingData.guests),
        bedrooms: Number(listingData.bedrooms),
        bathrooms: Number(listingData.bathrooms),
        images: (listingData.images || []).map(cleanString),
      };

      // Validate before sending
      validatePayload(payload);

      console.log("Submitting listing payload:", payload);

      const response = await axios.post(
        "http://localhost:4000/api/listings",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setListings((prev) => [...prev, response.data.data]);
      return { success: true, data: response.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to add listing.";
      console.error("addListing error:", err);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Update existing listing
  const updateListing = async (id, listingData, token) => {
    try {
      const payload = {
        title: cleanString(listingData.title),
        description: cleanString(listingData.description),
        location: cleanString(listingData.location),
        type: cleanString(listingData.type) || "house",
        amenities: (listingData.amenities || []).map(cleanString),
        price: Number(listingData.price),
        guests: Number(listingData.guests),
        bedrooms: Number(listingData.bedrooms),
        bathrooms: Number(listingData.bathrooms),
        images: (listingData.images || []).map(cleanString),
      };

      validatePayload(payload);

      const response = await axios.put(
        `http://localhost:4000/api/listings/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setListings((prev) =>
        prev.map((listing) => (listing._id === id ? response.data.data : listing))
      );

      return { success: true, data: response.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update listing.";
      console.error("updateListing error:", err);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Delete a listing
  const deleteListing = async (id, token) => {
    try {
      await axios.delete(`http://localhost:4000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setListings((prev) => prev.filter((listing) => listing._id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete listing.";
      console.error("deleteListing error:", err);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  return (
    <ListingContext.Provider
      value={{
        listings,
        loading,
        error,
        addListing,
        updateListing,
        deleteListing,
        setError,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};

export const useListings = () => useContext(ListingContext);
