import React from 'react';
import { Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useListings } from "../../context/ListingContext";
import { Plus, List, Home, TrendingUp, Users, DollarSign } from "lucide-react";

function AdminDashboard() {
  const { adminUser } = useAdminAuth();
  const { listings } = useListings();

  if (!adminUser) {
    return <div className="text-center p-6">Please log in to view the admin dashboard.</div>;
  }

  const totalListings = listings.length;
  const totalRevenue = listings.reduce((sum, listing) => sum + listing.price * 30, 0);
  const averageRating =
    listings.length > 0 ? listings.reduce((sum, listing) => sum + (listing.rating || 0), 0) / listings.length : 0;
  const totalReviews = listings.reduce((sum, listing) => sum + (listing.reviews || 0), 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <p className="text-center text-lg mb-8">
        Welcome, {adminUser.username || adminUser.email.split('@')[0]}!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/listings/create"
          className="group bg-gradient-to-r from-[#FF385C] to-[#E31C5F] rounded-xl p-8 text-white hover:from-[#E31C5F] hover:to-[#C13584] transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Create New Listing</h3>
              <p className="text-red-100 group-hover:text-white transition-colors">
                Add a new South African property to your portfolio
              </p>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Plus className="w-8 h-8" />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/listings"
          className="group bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#FF385C] transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Manage Listings</h3>
              <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
                View and edit your existing properties
              </p>
            </div>
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-red-50 transition-colors">
              <List className="w-8 h-8 text-gray-600 group-hover:text-[#FF385C]" />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/bookings"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-2">View Bookings</h2>
          <p className="text-gray-600">Review and manage all customer bookings.</p>
        </Link>

        <Link
          to="/admin/users"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Manage Users</h2>
          <p className="text-gray-600">Oversee customer and admin accounts.</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Listings</p>
              <p className="text-3xl font-bold text-gray-900">{totalListings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+2</span>
            <span className="text-gray-600 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">R{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-600 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+0.2</span>
            <span className="text-gray-600 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+24</span>
            <span className="text-gray-600 ml-1">from last month</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Listings</h2>
        </div>
        {listings.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {listings.slice(0, 3).map((listing) => (
              <div key={listing._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {listing.image && (
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                      <p className="text-gray-600">{listing.location}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span>R{listing.price.toLocaleString()}/night</span>
                        <span className="mx-2">•</span>
                        <span>
                          ⭐ {listing.rating || "N/A"} ({listing.reviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/admin/listings/edit/${listing._id}`}
                    className="px-4 py-2 bg-[#FF385C] text-white text-sm font-medium rounded-lg hover:bg-[#E31C5F] transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first South African property listing.</p>
            <Link
              to="/admin/listings/create"
              className="inline-flex items-center px-6 py-3 bg-[#FF385C] text-white font-medium rounded-lg hover:bg-[#E31C5F] transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
