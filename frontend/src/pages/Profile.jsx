import React, { useState, useEffect } from "react";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setUser({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      age: "25",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-content">
        <div className="profile-form">
        <div className="form-group">
          <label>Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          ) : (
            <span>{user.name}</span>
          )}
        </div>
        <div className="form-group">
          <label>Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          ) : (
            <span>{user.email}</span>
          )}
        </div>
        <div className="form-group">
          <label>Phone:</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
          ) : (
            <span>{user.phone}</span>
          )}
        </div>
        <div className="form-group">
          <label>Age:</label>
          {isEditing ? (
            <input
              type="number"
              name="age"
              value={user.age}
              onChange={handleChange}
              min="1"
              max="120"
            />
          ) : (
            <span>{user.age}</span>
          )}
        </div>
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
