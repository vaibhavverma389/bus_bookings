import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css"; 

export default function AdminDashboard() {
  const stats = [
    { emoji: "🚌", title: "Manage Buses", desc: "Add, edit, or remove buses", link: "/admin/buses" },
    { emoji: "⏰", title: "Manage Bookings", desc: "View and manage all bookings", link: "/admin/bookings" },
    { emoji: "🛡️", title: "Manage Users", desc: "View and manage user accounts", link: "/admin/users" },
    { emoji: "⭐", title: "Reports", desc: "Generate booking and revenue reports", link: "/admin/reports" },
  ];

  return (
    <div className="admin-dashboard-container">
      <h2>Welcome Admin!</h2>
      <div className="admin-dashboard-grid">
        {stats.map((stat, idx) => (
          <div className="admin-dashboard-card" key={idx}>
            <div className="admin-dashboard-icon">{stat.emoji}</div>
            <h3>{stat.title}</h3>
            <p>{stat.desc}</p>
            <Link className="admin-dashboard-btn" to={stat.link}>Go</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
