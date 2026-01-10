import React, { useEffect, useState } from "react";
import API from "../api";
import "./ManageUsers.css"; // Create this file for styles

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const loadUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditRole = (user) => {
    setEditingUser(user);
    setNewRole(user.role);
  };

  const handleSaveRole = async () => {
    try {
      await API.put(`/users/${editingUser._id}/role`, { role: newRole });
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewRole("");
  };

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {editingUser && editingUser._id === user._id ? (
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUser && editingUser._id === user._id ? (
                  <>
                    <button className="save-btn" onClick={handleSaveRole}>Save</button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => handleEditRole(user)}>Edit Role</button>
                    <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
