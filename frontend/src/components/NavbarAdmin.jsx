import React from "react";
import { Link } from "react-router-dom";
import { Bus } from "lucide-react";
import "./NavbarAdmin.css";

export default function NavbarAdmin() {
  return (
    <nav className="navbar-admin">
      <div className="navbar-admin-left">
        <div className="navbar-admin-logo-container">
           <Link to="/admin" aria-label="AdminDashboard" className="navbar-admin-logo-link">
            <Bus className="navbar-admin-logo-icon" />
           </Link>
        </div>
        <span className="navbar-admin-title">Smart Bus Admin</span>
      </div>
      <div className="navbar-admin-right">
        <Link to="/admin" className="navbar-admin-link">Dashboard</Link>
        <Link to="/admin/buses" className="navbar-admin-link">Buses</Link>
        <Link to="/admin/bookings" className="navbar-admin-link">Bookings</Link>
        <Link to="/admin/users" className="navbar-admin-link">Users</Link>
        <Link to="/" className="navbar-admin-logout-link">Logout</Link>
      </div>
    </nav>
  );
}
