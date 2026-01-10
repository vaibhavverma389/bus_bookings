import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import './BookBus.css';

export default function BookBus() {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusDetails();
  }, [busId]);

  const fetchBusDetails = async () => {
    try {
      const seatData = await API.get(`/bookings/seats/${busId}`);
      const busInfo = await API.get(`/buses/${busId}`);
      setBus({ ...busInfo.data, ...seatData.data });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSeats = () => {
    const seats = [];
    for (let i = 1; i <= bus.capacity; i++) {
      seats.push(`S${i}`);
    }
    return seats;
  };

  const handleSeatClick = (seatNumber) => {
    if (bus.bookedSeats?.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // 💳 Razorpay Payment + Booking
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const totalAmount = selectedSeats.length * bus.fare;

    try {
      // 1️⃣ Create Razorpay order
      const orderRes = await API.post("/payment/create-order", {
        amount: totalAmount,
      });

      const { id: order_id, amount } = orderRes.data;

      // 2️⃣ Razorpay Checkout
      const options = {
        key: "rzp_test_RjvHG9WDrUYF5F",
        amount: amount,
        currency: "INR",
        name: "Smart Bus Booking",
        description: `Bus ${bus.busNumber} Seat Booking`,
        order_id: order_id,

        handler: async function (response) {
          try {
            // 3️⃣ Verify payment
            const verifyRes = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes.data.success) {
              return alert("Payment verification failed!");
            }

            // 4️⃣ Save Booking
            await API.post("/bookings", {
              busId,
              seatNumbers: selectedSeats,
              totalAmount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });

            alert("Booking successful!");
            navigate("/my-bookings");

          } catch (err) {
            console.log(err);
            alert("Error confirming booking!");
          }
        },

        theme: { color: "#4CAF50" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      alert("Payment could not be initiated.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!bus) return <div>Bus not found</div>;

  const totalAmount = selectedSeats.length * bus.fare;

  return (
    <div className="book-bus-container">
      <h2>Book Bus - {bus.busNumber}</h2>

      <div className="booking-content">

        {/* Seat Selector */}
        <div className="seat-selection">
          <h3>Select Seats</h3>
          <div className="seat-map">
            {generateSeats().map(seatNumber => (
              <button
                key={seatNumber}
                className={`seat ${
                  bus.bookedSeats?.includes(seatNumber)
                    ? "booked"
                    : selectedSeats.includes(seatNumber)
                    ? "selected"
                    : "available"
                }`}
                onClick={() => handleSeatClick(seatNumber)}
                disabled={bus.bookedSeats?.includes(seatNumber)}
              >
                {seatNumber}
              </button>
            ))}
          </div>

          <div className="seat-legend">
            <span><div className="seat available"></div> Available</span>
            <span><div className="seat selected"></div> Selected</span>
            <span><div className="seat booked"></div> Booked</span>
          </div>
        </div>

        {/* Payment Section */}
        <div className="payment-section">
          <h3>Payment Details</h3>
          <p><strong>Selected Seats ({selectedSeats.length}):</strong></p>

          {selectedSeats.length > 0 ? (
            <div className="seat-tags">
              {selectedSeats.map(seat => (
                <span key={seat} className="seat-tag">{seat}</span>
              ))}
            </div>
          ) : (
            <p style={{ color: "#999" }}>No seats selected</p>
          )}

          <p>Fare per seat: ₹{bus.fare}</p>
          <p><strong>Total Amount: ₹{totalAmount}</strong></p>

          <button
            className="confirm-booking-btn"
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
          >
            Pay & Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
}
