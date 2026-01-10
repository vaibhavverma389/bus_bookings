import express from "express";
import Booking from "../Models/Booking.js";
import { Bus } from "../Models/Bus.js";
import { protect, adminOnly } from "../Middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------
   GET SEATS FOR A BUS
--------------------------- */
router.get("/seats/:busId", protect, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.json({
      capacity: bus.capacity,
      bookedSeats: bus.bookedSeats,
      fare: bus.fare
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* --------------------------
   CREATE BOOKING (after Razorpay Payment)
--------------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const { busId, seatNumbers, totalAmount, paymentId, orderId } = req.body;

    // REQUIRED FIELDS CHECK
    if (!busId || !seatNumbers || !paymentId || !orderId) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // 100% SAFE SEAT PARSING
    let parsedSeats = [];
    try {
      parsedSeats = Array.isArray(seatNumbers)
        ? seatNumbers
        : JSON.parse(seatNumbers);
    } catch (err) {
      return res.status(400).json({ message: "Invalid seatNumbers format" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // Already booked seat check
    const alreadyBooked = parsedSeats.some((s) =>
      bus.bookedSeats.includes(s)
    );

    if (alreadyBooked) {
      return res.status(400).json({
        message: "Some selected seats are already booked."
      });
    }

    // SAVE BOOKING
    const booking = await Booking.create({
      userId: req.user.id,
      busId,
      seatNumbers: parsedSeats,
      totalAmount,
      paymentId,
      orderId,
      paymentStatus: "paid",
      status: "confirmed"
    });

    // UPDATE BUS SEATS
    await Bus.findByIdAndUpdate(busId, {
      $push: { bookedSeats: { $each: parsedSeats } },
      $inc: { seatsAvailable: -parsedSeats.length }
    });

    res.json({ success: true, booking });

  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* --------------------------
   USER – MY BOOKINGS
--------------------------- */
router.get("/my", protect, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id })
    .populate("busId");
  res.json(bookings);
});

/* --------------------------
   ADMIN – All Bookings
--------------------------- */
router.get("/", protect, adminOnly, async (req, res) => {
  const bookings = await Booking.find()
    .populate("busId")
    .populate("userId", "name email");

  res.json(bookings);
});

/* --------------------------
   ADMIN – Verify Payment
--------------------------- */
router.patch("/:id/verify", protect, adminOnly, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.json({ message: "Payment status updated", booking });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* --------------------------
   ADMIN – Delete Booking
--------------------------- */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await Bus.findByIdAndUpdate(booking.busId, {
      $pull: { bookedSeats: { $in: booking.seatNumbers } },
      $inc: { seatsAvailable: booking.seatNumbers.length }
    });

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* --------------------------
   USER – Cancel Booking
--------------------------- */
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      req.user.role !== "admin" &&
      booking.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    await Bus.findByIdAndUpdate(booking.busId, {
      $pull: { bookedSeats: { $in: booking.seatNumbers } },
      $inc: { seatsAvailable: booking.seatNumbers.length }
    });

    res.json({ message: "Booking cancelled", booking });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
