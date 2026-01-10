import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  date: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  startPoint: { type: String, required: true },
  destination: { type: String, required: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  capacity: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  bookedSeats: { type: [String], default: [] },


  isAc: { type: Boolean, required: true },

  fare: { type: Number, required: true },
  notes: { type: String, default: "" }
});

const Bus = mongoose.model("Bus", busSchema);
export { Bus };
export default Bus;
