import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  seatNumbers: { type: [String], required: true },
  totalAmount: { type: Number, required: true },

  utrNumber: { type: String },
  transactionScreenshot: { type: String },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "verified", "rejected"],
    default: "pending"
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
