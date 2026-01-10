import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../api";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 80, easing: "ease-out-cubic" });
    // refresh in case images/fonts load late
    window.addEventListener("load", () => AOS.refresh());
    return () => window.removeEventListener("load", () => AOS.refresh());
  }, []);

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age, 10) : null,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-overlay" aria-hidden="true" />
      <main className="register-wrapper" role="main">
        <section
          className="register-card"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          <header className="register-header">
            <h1 className="register-title">Join Smart Bus</h1>
            <p className="register-subtitle">Create your account to start booking buses</p>
          </header>

          <form onSubmit={handleSubmit} className="register-form" autoComplete="off" noValidate>
            <div className="register-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                aria-required="true"
              />
            </div>

            <div className="register-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                aria-required="true"
              />
            </div>

            <div className="register-form-row">
              <div className="register-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  inputMode="tel"
                />
              </div>

              <div className="register-field">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                aria-required="true"
                minLength={6}
              />
            </div>

            <div className="register-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                aria-required="true"
                minLength={6}
              />
            </div>

            {error && <p className="register-error" role="alert">{error}</p>}

            <div className="register-actions">
              <button
                type="submit"
                className={`register-btn ${loading ? "loading" : ""}`}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="register-link">Login</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
