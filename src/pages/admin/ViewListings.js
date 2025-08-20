import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useListings } from "../../context/ListingContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

function ViewListings() {
  const { listings, loading, error, deleteListing, setError: setListingError } = useListings();
  const { adminUser } = useAdminAuth();
  const [deleteMessage, setDeleteMessage] = useState(null);

  useEffect(() => {
    setListingError(null);
  }, [setListingError]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setDeleteMessage(null);
      try {
        const result = await deleteListing(id, adminUser.token);
        if (result.success) {
          setDeleteMessage("Listing deleted successfully!");
        } else {
          setDeleteMessage(result.error || "Failed to delete listing.");
        }
      } catch (err) {
        setDeleteMessage("An unexpected error occurred during deletion.");
        console.error("Delete listing error:", err);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading listings...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-700">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Listings</h1>
      <Link
        to="/admin/listings/create"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4 inline-block"
      >
        Create New Listing
      </Link>

      {deleteMessage && (
        <div
          className={`p-3 rounded mb-4 ${
            deleteMessage.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {deleteMessage}
        </div>
      )}

      {listings.length === 0 ? (
        <p className="text-gray-600">No listings found. Start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link to={`/admin/listings/edit/${listing._id}`} key={listing._id} className="block">
              <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={listing.images && listing.images.length > 0 ? listing.images[0] : "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                  <p className="text-gray-600 mb-1">
                    {listing.location}, {listing.city}, {listing.country}
                  </p>
                  <p className="text-gray-800 font-bold mb-2">R{listing.price} / night</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(listing._id);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewListings;
