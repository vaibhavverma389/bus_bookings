import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import BookBus from "./pages/BookBus";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManageBuses from "./pages/ManageBuses";
import ManageUsers from "./pages/ManageUsers";
import ManageBookings from "./pages/ManageBookings";
import SearchResults from "./pages/SearchResults";
import HomePage from "./pages/HomePage";

import NavbarLanding from "./components/NavbarLanding";
import NavbarUser from "./components/NavbarUser";
import NavbarAdmin from "./components/NavbarAdmin";

/* ------------------- JWT Decode Function ------------------- */
function decodeToken(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

/* ------------------- Updated NavbarSelector ------------------- */
function NavbarSelector() {
  const { pathname } = useLocation();
  const token = localStorage.getItem("token");

  // Pages that must ALWAYS show Landing Navbar
  const landingPages = ["/", "/login", "/register"];

  if (landingPages.includes(pathname)) {
    return <NavbarLanding />;
  }

  let role = null;

  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      role = payload.role;
    } catch (e) {
      role = null;
    }
  }

  if (role === "admin") return <NavbarAdmin />;
  if (role === "user") return <NavbarUser />;

  return <NavbarLanding />;
}



function App() {
  return (
    <BrowserRouter>
      <NavbarSelector />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user" element={<UserDashboard />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book/:busId" element={<BookBus />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/buses" element={<ManageBuses />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />
        <Route path="/admin/users" element={<ManageUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
