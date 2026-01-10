import React, { useEffect, useState } from "react";
import API from "../api";
import "./MyBookings.css"; // Create this file for styles

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/my").then((res) => setBookings(res.data));
  }, []);

  return (
    <div className="mybookings-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings found.</p>}
      <div className="mybookings-list">
        {bookings.map((b) => (
          <div className="mybookings-card" key={b._id}>
            <p><strong>Bus:</strong> {b.busId.busNumber}</p>
            <p><strong>Route:</strong> {b.busId.startPoint} → {b.busId.destination}</p>
            <p><strong>Date:</strong> {b.busId.date}</p>
            <p><strong>Seats:</strong> {b.seatNumbers.join(", ")}</p>
            <p><strong>Amount:</strong> ₹{b.totalAmount}</p>
            <p><strong>UTR Number:</strong> {b.utrNumber || 'N/A'}</p>
            <p><strong>Payment Status:</strong> 
              <span className={`status ${b.paymentStatus}`}>{b.paymentStatus}</span>
            </p>
            <p><strong>Booking Status:</strong> {b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
