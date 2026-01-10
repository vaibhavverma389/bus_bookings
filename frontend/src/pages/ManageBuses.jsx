import React, { useEffect, useState } from "react";
import API from "../api";
import "./ManageBuses.css";

export default function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    startPoint: "",
    destination: "",
    driverName: "",
    driverPhone: "",
    capacity: 40,
    seatsAvailable: 40,
    isAc: true,        // UPDATED (IFAC)
    fare: 0,
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBuses = async () => {
    try {
      const { data } = await API.get("/buses");
      setBuses(data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/buses/${id}`);
      loadBuses();
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/buses", formData);
      setShowAddForm(false);

      setFormData({
        busNumber: "",
        date: "",
        departureTime: "",
        arrivalTime: "",
        startPoint: "",
        destination: "",
        driverName: "",
        driverPhone: "",
        capacity: 40,
        seatsAvailable: 40,
        isAc: true,   // RESET
        fare: 0,
        notes: ""
      });

      loadBuses();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add bus.");
      console.error("Error adding bus:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-buses-container">
      <h2>Manage Buses</h2>
      <button className="add-bus-btn" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Cancel" : "Add New Bus"}
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-bus-form">
          <h3>Add New Bus</h3>
          {error && <p className="error-message">{error}</p>}

          {/* Bus Number + Date */}
          <div className="form-row">
            <div className="form-group">
              <label>Bus Number:</label>
              <input
                type="text"
                name="busNumber"
                value={formData.busNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Time */}
          <div className="form-row">
            <div className="form-group">
              <label>Departure Time:</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Arrival Time:</label>
              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Points */}
          <div className="form-row">
            <div className="form-group">
              <label>Start Point:</label>
              <input
                type="text"
                name="startPoint"
                value={formData.startPoint}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Destination:</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Driver */}
          <div className="form-row">
            <div className="form-group">
              <label>Driver Name:</label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Driver Phone:</label>
              <input
                type="tel"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Capacity + Fare */}
          <div className="form-row">
            <div className="form-group">
              <label>Capacity:</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Fare:</label>
              <input
                type="number"
                name="fare"
                value={formData.fare}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes:</label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* AC Type (IFAC) */}
          <div className="form-group">
            <label>Air Conditioning:</label>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="isAc"
                  checked={formData.isAc === true}
                  onChange={() => setFormData({ ...formData, isAc: true })}
                />
                AC
              </label>

              <label>
                <input
                  type="radio"
                  name="isAc"
                  checked={formData.isAc === false}
                  onChange={() => setFormData({ ...formData, isAc: false })}
                />
                Non-AC
              </label>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding Bus..." : "Add Bus"}
          </button>
        </form>
      )}

      {/* Bus List */}
      <table className="buses-table">
        <thead>
          <tr>
            <th>Bus Number</th>
            <th>Route</th>
            <th>Date</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Capacity</th>
            <th>Fare</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {buses.map(bus => (
            <tr key={bus._id}>
              <td>{bus.busNumber}</td>
              <td>{bus.startPoint} → {bus.destination}</td>
              <td>{new Date(bus.date).toLocaleDateString()}</td>
              <td>{bus.departureTime}</td>
              <td>{bus.arrivalTime}</td>
              <td>{bus.capacity}</td>
              <td>₹{bus.fare}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(bus._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
