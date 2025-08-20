import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.js"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { CustomerAuthProvider } from "./context/CustomerAuthContext.js" 
import { AdminAuthProvider } from "./context/AdminAuthContext.js" 
import { BookingProvider } from "./context/BookingContext.js"
import { ListingProvider } from "./context/ListingContext.js"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CustomerAuthProvider>
      <AdminAuthProvider>
        <ListingProvider>
          {" "}
          <BookingProvider>
            {" "}
            <App />
          </BookingProvider>
        </ListingProvider>
      </AdminAuthProvider>
    </CustomerAuthProvider>
  </BrowserRouter>,
)
