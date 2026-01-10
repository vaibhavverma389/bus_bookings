// src/components/SuccessAnimation.jsx
import React from "react";
import Lottie from "lottie-react";
import successAnim from "../animations/success.json"; // <-- adjust path if needed

export default function SuccessAnimation({ size = 180 }) {
  return (
    <div style={{ width: size + "px", margin: "0 auto" }}>
      <Lottie animationData={successAnim} loop={false} />
    </div>
  );
}
