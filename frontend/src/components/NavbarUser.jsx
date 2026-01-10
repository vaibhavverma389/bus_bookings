import React from "react";
import { Link } from "react-router-dom";
import { Bus } from "lucide-react";
import "./NavbarUser.css";

export default function NavbarUser() {
  return (
    <nav className="navbar-user">
      <div className="navbar-user-left">
        <div className="navbar-user-logo-container">
          <Link to="/user" aria-label="UserDashboard" className="navbar-user-logo-link">
          <Bus className="navbar-user-logo-icon" />
           </Link>
        </div>
        <span className="navbar-user-title">Smart Bus</span>
      </div>
      <div className="navbar-user-right">
        <Link to="/user" className="navbar-user-link">Dashboard</Link>
        <Link to="/profile" className="navbar-user-link">Profile</Link>
        <Link to="/my-bookings" className="navbar-user-link">My Bookings</Link>
        <Link to="/" className="navbar-user-logout-link">Logout</Link>
      </div>
    </nav>
  );
}
