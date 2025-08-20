import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Globe, Search } from "lucide-react"
import { useListings } from "../../context/ListingContext"

function NextTrip() {
  const trips = [
    {
      title: "Sandton City\nHotel",
      distance: "53km",
      image:
        "https://sandtontimes.co.za/wp-content/uploads/2022/08/sandtontimes-sandton-towers-hotel-exterior-2000x1125-1.jpg",
      bgColor: "bg-pink-600",
    },
    {
      title: "Joburg City\nHotel",
      distance: "53km",
      image:
        "https://www.doreebonner.co.uk/wp-content/uploads/2023/07/moving-to-johannesburg.jpg",
      bgColor: "bg-orange-600",
    },
    {
      title: "Woodmead City\nHotel",
      distance: "53km",
      image:
        "https://images.trvl-media.com/lodging/35000000/34160000/34157500/34157423/4aa4f745.jpg?impolicy=fcrop&w=357&h=201&p=1&q=medium",
      bgColor: "bg-pink-700/90",
    },
    {
      title: "Hyde Park\nHotel",
      distance: "53km",
      image:
        "https://cdn.audleytravel.com/3959/2826/79/1029099-cape-town.jpg",
      bgColor: "bg-pink-600",
    },
  ]

  return (
    <section className="py-20">
      <h2 className="text-3xl font-semibold mb-10 text-center">
        Inspiration for your next trip
      </h2>
      <div className="flex flex-wrap justify-center gap-6 px-4">
        {trips.map((trip, idx) => (
          <div
            key={idx}
            className={`w-64 rounded-xl overflow-hidden shadow-lg flex-shrink-0 ${trip.bgColor}`}
          >
            <img src={trip.image} alt={trip.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg whitespace-pre-line">
                {trip.title}
              </h3>
              <p className="text-white mt-2 mb-8">{trip.distance}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function FutureGetaways() {
  const categories = [
    {
      title: "Destinations for arts & culture",
      items: ["Johannesburg", "Pretoria", "Durban"]
    },
    {
      title: "Destinations for outdoor adventure",
      items: ["Cape Town", "Garden Route", "Drakensberg"]
    },
    {
      title: "Mountain cabins",
      items: ["Magaliesberg", "Cederberg", "Tsitsikamma"]
    },
    {
      title: "Beach destinations",
      items: ["Umhlanga", "Camps Bay", "Ballito"]
    },
    {
      title: "Popular destinations",
      items: ["Soweto", "Stellenbosch", "Sun City"]
    },
    {
      title: "Unique Stays",
      items: ["Sabi Sand", "Wild Coast", "Wine Farms"]
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Inspiration for future getaways</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-600 hover:text-gray-900 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const { listings } = useListings()
  const [uniqueLocations, setUniqueLocations] = useState([])

  useEffect(() => {
    if (listings.length > 0) {
      const locations = [...new Set(listings.map((listing) => listing.location))]
      setUniqueLocations(locations)
    }
  }, [listings])

  const handleFlexibleClick = () => {
    navigate("/location")
  }

  const experiences = [
    {
      title: "Things to do on your trip",
      buttonText: "Experiences",
      image:
        "https://www.travelstart.co.za/blog/wp-content/uploads/2018/11/sunset-cableway.jpg",
    },
    {
      title: "Things to do from home",
      buttonText: "Online Experiences",
      image:
        "https://imagedelivery.net/0LMYosKeo5o-LXOCjdKUuA/tourscanner.com/2022/06/The-Cape-Wheel-Cape-Town.jpg/w=9999",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <section className="relative h-[75vh] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Not sure where to go? Perfect.
          </h1>
          <button
            onClick={handleFlexibleClick}
            className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-full shadow-lg flex items-center justify-center gap-2 hover:scale-105 hover:bg-gray-100 transition"
          >
            <Search className="w-5 h-5" />
            I'm flexible
          </button>
        </div>
      </section>


      <NextTrip />
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">Discover Airbnb Experiences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-2xl font-bold mb-4">{exp.title}</h3>
                  <button className="px-6 py-2 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-200">
                    {exp.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">
              Shop Airbnb <br /> gift cards
            </h2>
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
              Learn more
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://fantasticostudio.co/wp-content/uploads/2022/09/airbnb_laura_niubo_giftcards.png"
              alt="Gift card"
              className="w-72 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Try hosting</h2>
              <p className="text-lg text-gray-600 mb-6">
                Earn extra income and unlock new opportunities by sharing your
                space.
              </p>
              <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                Learn more
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/027/875/928/small_2x/happy-young-african-american-woman-with-black-curly-afro-hair-style-and-big-toothy-smile-on-brown-background-with-copy-space-ai-generative-photo.jpg"
                alt="Hosting"
                className="rounded-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      <FutureGetaways />
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600">
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Safety information</li>
              <li>Cancellation options</li>
              <li>Our COVID-19 Response</li>
              <li>Supporting people with disabilities</li>
              <li>Report a neighborhood concern</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>Airbnb.org: disaster relief housing</li>
              <li>Support Afghan refugees</li>
              <li>Celebrating diversity & belonging</li>
              <li>Combating discrimination</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li>Try hosting</li>
              <li>AirCover: protection for Hosts</li>
              <li>Explore hosting resources</li>
              <li>Visit our community forum</li>
              <li>How to host responsibly</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li>Newsroom</li>
              <li>Learn about new features</li>
              <li>Letter from our founders</li>
              <li>Careers</li>
              <li>Investors</li>
              <li>Airbnb Luxe</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <span>© 2025 Airbnb, Inc. · Privacy · Terms · Sitemap</span>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>English (ZA)</span>
            </div>
            <span>R (ZAR)</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage