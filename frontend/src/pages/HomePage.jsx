import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./HomePage.css";

export default function HomePage() {
  const btnRef = useRef(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
  duration: 700,
  once: true,
  offset: 120, // increased from default
  easing: "ease-out-cubic",
});

    // refresh AOS if images/fonts load late
    window.addEventListener("load", () => AOS.refresh());
    return () => window.removeEventListener("load", () => AOS.refresh());
  }, []);

  // Magnetic button hover logic
  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // gentle translate
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.12}px)`;
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = "translate(0, 0)";
  };

  return (
    <>
      {/* HERO with background image */}
      <div className="background-img">
        <div className="overlay" />

        <div
          className="homepage-hero"
          data-aos="fade-up"
          data-aos-delay="50"
          data-aos-duration="900"
        >
          <h1 data-aos="zoom-in" data-aos-delay="120">
            Smart Bus Booking
          </h1>
          <p data-aos="fade-up" data-aos-delay="160">
            Book buses easily for your college trips and exams. Manage bookings
            effortlessly — fast, secure, and student friendly.
          </p>

          <Link
            to="/login"
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="homepage-btn magnet-btn"
            data-aos="zoom-in"
            data-aos-delay="220"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* FEATURES OUTSIDE HERO (keeps scroll space) */}
      <div className="homepage-features" id="features">
        <h2 data-aos="fade-up">🚀 Features</h2>

        <div className="features-grid">
          <div
            className="feature-card"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="feature-icon">🚌</div>
            <h3>Easy Booking</h3>
            <p>Search buses and book your seat instantly. Fast and reliable.</p>
          </div>

          <div
            className="feature-card"
            data-aos="fade-up"
            data-aos-delay="180"
          >
            <div className="feature-icon">🛡️</div>
            <h3>Admin Dashboard</h3>
            <p>Manage buses, users, and bookings with detailed analytics.</p>
          </div>

          <div
            className="feature-card"
            data-aos="fade-up"
            data-aos-delay="260"
          >
            <div className="feature-icon">👤</div>
            <h3>User Dashboard</h3>
            <p>View your bookings, track seats, and cancel if needed.</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="homepage-footer" data-aos="fade-up" data-aos-delay="120">
        <div className="footer-grid">
          <div>
            <h3>Smart Bus Booking</h3>
            <p>Your reliable partner for bus bookings. Easy, fast, and secure.</p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Sign Up</Link>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
            </ul>
          </div>

          <div>
            <h3>Contact Us</h3>
            <p>Email: support@smartbusbooking.com</p>
            <p>Phone: +91 1234567890</p>
            <p>Address: 123 Bus Street, City, State 12345</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{new Date().getFullYear()} Smart Bus Booking | All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
