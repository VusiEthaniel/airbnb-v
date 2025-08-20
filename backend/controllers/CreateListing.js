import Listing from "../models/Listing.js";

export const createListing = async (req, res) => {
  const { title, description, price, location, images, amenities, guests, bedrooms, bathrooms, type } = req.body;

  if (!images || !Array.isArray(images) || images.length !== 5) {
    return res.status(400).json({ error: "Exactly 5 images are required." });
  }

  try {
    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      images,
      amenities,
      guests,
      bedrooms,
      bathrooms,
      type,
      host: req.user._id, 
    });

    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
