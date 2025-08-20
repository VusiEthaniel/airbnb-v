import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    location: { type: String, required: [true, "Location is required"] },
    images: {
      type: [String], 
      required: [true, "At least one image is required"],
      validate: {
        validator: (arr) => arr.length > 0 && arr.length <= 5,
        message: "You must provide between 1 and 5 images",
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    guests: { type: Number, required: [true, "Number of guests is required"] },
    bedrooms: { type: Number, required: [true, "Number of bedrooms is required"] },
    bathrooms: { type: Number, required: [true, "Number of bathrooms is required"] },
    type: { type: String, default: "house" },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
