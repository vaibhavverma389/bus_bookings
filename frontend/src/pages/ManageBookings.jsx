import React, { useEffect, useState } from "react";
import API from "../api";
import "./ManageBookings.css"; 

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const { data } = await API.get("/bookings");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handlePaymentVerification = async (id, status) => {
    try {
      await API.patch(`/bookings/${id}/verify`, { paymentStatus: status });
      loadBookings();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.patch(`/bookings/${id}/cancel`);
      loadBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await API.delete(`/bookings/${id}`);
        loadBookings();
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  return (
    <div className="manage-bookings-container">
      <h2>Manage Bookings</h2>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Bus</th>
            <th>Seats</th>
            <th>Pickup Point</th>
            <th>Drop Point</th>
            <th>Amount</th>
            <th>Mobile Number</th>
            <th>Payment Status</th>            
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.userId?.name || booking.userId?.email}</td>
              <td>{booking.busId?.busNumber}</td>
              <td>{booking.seatNumbers?.join(", ")}</td>
              <td>{booking.busId?.startPoint}</td>
              <td>{booking.busId?.destination}</td>
              <td>₹{booking.totalAmount}</td>
              <td>{booking.userId?.email}</td>

              <td>
                <span className={`status ${booking.paymentStatus}`}>
                  {booking.paymentStatus}
                </span>
              </td>
              
                
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}