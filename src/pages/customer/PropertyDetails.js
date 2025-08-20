import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Wifi, Car, Coffee, Tv, Home } from "lucide-react";
import { useListings } from "../../context/ListingContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import axios from "axios";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings } = useListings();
  const { user: customerUser } = useCustomerAuth();

  const [listing, setListing] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (listings.length > 0) {
      const found = listings.find((l) => l._id === id);
      setListing(found);
    }
  }, [id, listings]);

  if (!listing) return <div className="text-center p-6">Loading property...</div>;

  const images = listing.images?.slice(0, 5) || [];

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const subtotal = listing.price * nights;
    const weeklyDiscount = nights >= 7 ? subtotal * 0.1 : 0;
    const cleaningFee = 75;
    const serviceFee = subtotal * 0.14;
    const taxes = subtotal * 0.12;
    const total = subtotal - weeklyDiscount + cleaningFee + serviceFee + taxes;
    return { nights, subtotal, weeklyDiscount, cleaningFee, serviceFee, taxes, total };
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!customerUser) {
      navigate("/login", { state: { from: `/property/${id}` } });
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setMessage("Please select check-in and check-out dates.");
      return;
    }

    const pricing = calculateTotal();
    const bookingData = {
      listingId: id,
      startDate: checkInDate,
      endDate: checkOutDate,
      guests,
      totalPrice: pricing.total
    };

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/api/bookings",
        bookingData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (data.success) navigate(`/booking-confirmation/${data.booking._id}`);
      else setMessage(data.message || "Booking failed.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking error.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatR = (amount) => `R${amount.toLocaleString()}`;
  const pricing = calculateTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-2">{listing.type || "Accommodation"} in {listing.location}</h1>
      <p className="text-gray-600 mb-4">{listing.guests || 8} guests • {listing.bedrooms || 4} bedrooms • {listing.bathrooms || 3} bathrooms</p>

      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-red-500" />
        <span className="font-semibold">{listing.rating || "4.9"}</span>
        <span className="text-gray-600">({listing.reviewCount || 127} reviews)</span>
        <span className="ml-4 flex items-center gap-1 text-gray-600">
          <MapPin className="w-4 h-4" /> {listing.location}
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-8 h-[500px]">
          {images.map((img, idx) => {
            if (idx === 0) {
              return (
                <div key={idx} className="col-span-2 row-span-2">
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                </div>
              );
            }
            return (
              <div key={idx}>
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">About this place</h2>
          <p className="text-gray-700">{listing.description}</p>

          <h3 className="text-lg font-semibold mt-4">Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            {(listing.amenities || ["WiFi", "Kitchen", "Parking", "TV"]).map((a, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {a === "WiFi" && <Wifi className="w-5 h-5" />}
                {a === "Kitchen" && <Coffee className="w-5 h-5" />}
                {a === "Parking" && <Car className="w-5 h-5" />}
                {a === "TV" && <Tv className="w-5 h-5" />}
                {a === "Pool" && <Home className="w-5 h-5" />}
                <span>{a}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Things to know</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700 text-sm">
              <div>
                <h3 className="font-semibold mb-2">House rules</h3>
                <ul className="space-y-1">
                  <li>🕒 Check-in: After 4:00 PM</li>
                  <li>🕒 Checkout: 10:00 AM</li>
                  <li>🔑 Self check-in with lockbox</li>
                  <li>🍼 Not suitable for infants (under 2 years)</li>
                  <li>🚭 No smoking</li>
                  <li>🐾 No pets</li>
                  <li>🎉 No parties or events</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Health & safety</h3>
                <ul className="space-y-1">
                  <li>✨ Committed to Airbnb's enhanced cleaning process</li>
                  <li>🧍 Airbnb's social-distancing and other COVID-19 guidelines apply</li>
                  <li>⛑️ Carbon monoxide alarm</li>
                  <li>🚨 Smoke alarm</li>
                  <li>💵 Security Deposit - if you damage the home, you may be charged up to $566</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cancellation policy</h3>
                <p>Free cancellation before Feb 14</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-8 border p-6 rounded-lg shadow-lg space-y-4">
          <div className="flex justify-between items-center text-xl font-semibold">
            <span>{formatR(listing.price)}</span>
            <span>/ night</span>
          </div>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold">Check-in</label>
                <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="text-xs font-semibold">Check-out</label>
                <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} min={checkInDate || new Date().toISOString().split("T")[0]} className="w-full border p-2 rounded" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Guests</label>
              <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="w-full border p-2 rounded">
                {[...Array(listing.guests || 8)].map((_, i) => <option key={i+1} value={i+1}>{i+1} {i+1===1?"guest":"guests"}</option>)}
              </select>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <div>Subtotal ({pricing.nights} nights): {formatR(pricing.subtotal)}</div>
              {pricing.weeklyDiscount > 0 && <div>Weekly discount: -{formatR(pricing.weeklyDiscount)}</div>}
              <div>Cleaning fee: {formatR(pricing.cleaningFee)}</div>
              <div>Service fee: {formatR(pricing.serviceFee)}</div>
              <div>Taxes & occupancy fees: {formatR(pricing.taxes)}</div>
              <div className="font-semibold mt-2">Total: {formatR(pricing.total)}</div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded font-semibold hover:from-red-600 hover:to-pink-600">
              {loading ? "Processing..." : "Reserve"}
            </button>
          </form>

          {message && <p className="text-red-600 text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;