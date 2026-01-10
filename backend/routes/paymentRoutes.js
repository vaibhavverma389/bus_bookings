import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, "../.env") });

// Debug ENV (remove later)
console.log("PAYMENT ENV:", process.env.RZP_KEY, process.env.RZP_SECRET);

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RZP_KEY,
  key_secret: process.env.RZP_SECRET,
});

/* -----------------------------
   CREATE PAYMENT ORDER
------------------------------ */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert rupees → paise
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (error) {
    console.log("ORDER ERROR:", error);
    res.status(500).json({ message: "Payment order creation failed" });
  }
});

/* -----------------------------
   VERIFY PAYMENT SIGNATURE
------------------------------ */
router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RZP_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    return res.json({ success: true, message: "Payment verified successfully" });
  }

  return res.status(400).json({ success: false, message: "Payment verification failed" });
});

export default router;
