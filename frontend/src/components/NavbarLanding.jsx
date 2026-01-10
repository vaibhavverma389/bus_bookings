import React from "react";
import { Bus } from "lucide-react";
import { Link } from "react-router-dom";
import "./NavbarLanding.css";

export default function NavbarLanding() {
  return (
    <nav className="navbar-landing">
      <div className="navbar-landing-left">
        <div className="navbar-landing-logo-container">
          <Link to="/" aria-label="Home" className="navbar-landing-logo-link">
            <Bus className="navbar-landing-logo-icon" />
          </Link>
        </div>
        <span className="navbar-landing-title">Smart Bus</span>
      </div>

      <div className="navbar-landing-right">
        <Link to="/login">
          <button className="navbar-landing-login-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="navbar-landing-signup-button">Sign Up</button>
        </Link>
      </div>
    </nav>
  );
}
