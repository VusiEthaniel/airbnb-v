import mongoose from "mongoose"
import dotenv from "dotenv"
import Listing from "./models/Listing.js" 
import User from "./models/User.js" 

dotenv.config()

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB connected for seeding")

    // Create a placeholder admin user if one doesn't exist
    let adminUser = await User.findOne({ role: "admin" })
    if (!adminUser) {
      console.log("No admin user found, creating a placeholder admin...")
      adminUser = await User.create({
        username: "adminuser",
        email: "admin@example.com",
        password: "adminpassword",
        role: "admin",
      })
      console.log("Placeholder admin created:", adminUser.email)
    }

    const listings = [
      {
        title: "Cozy Beachfront Bungalow",
        description: "A charming bungalow right on the beach, perfect for a relaxing getaway.",
        price: 150,
        location: "Malibu",
        image:
          "https://images.unsplash.com/photo-1570129477492-45c003edd2ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGhvdXNlfGVufDB8fHx8MTY3ODg4NjQ0MQ&ixlib=rb-4.0.3&q=80&w=1080",
        amenities: ["wifi", "kitchen", "parking", "ocean view"],
        guests: 4,
        bedrooms: 2,
        bathrooms: 1,
        type: "house",
        host: adminUser._id,
      },
      {
        title: "Modern Downtown Apartment",
        description: "Sleek and stylish apartment in the heart of the city, close to all attractions.",
        price: 100,
        location: "New York",
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwwfHx8fDE2Nzg4ODY0NDI&ixlib=rb-4.0.3&q=80&w=1080",
        amenities: ["wifi", "kitchen", "gym"],
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        type: "apartment",
        host: adminUser._id,
      },
      {
        title: "Rustic Cabin in the Woods",
        description: "Escape to nature in this cozy cabin, surrounded by lush forests and hiking trails.",
        price: 80,
        location: "Asheville",
        image:
          "https://images.unsplash.com/photo-1505843513577-22bb76c60639?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxjYWJpbiUyMGluJTIwd29vZHN8ZW58MHx8fHwxNjc4ODg2NDQz&ixlib=rb-4.0.3&q=80&w=1080",
        amenities: ["fireplace", "parking"],
        guests: 3,
        bedrooms: 1,
        bathrooms: 1,
        type: "cabin",
        host: adminUser._id,
      },
    ]

    await Listing.deleteMany({})
    console.log("Existing listings removed")

    await Listing.insertMany(listings)
    console.log("Listings seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    mongoose.connection.close()
  }
}

seedDB()
