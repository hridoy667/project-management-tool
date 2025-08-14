import React, { useState } from "react";
import axios from "../../api/axios";

const UsersTable = ({ users: initialUsers }) => {
  const [users, setUsers] = useState(
    (initialUsers || []).filter(u => u.role.name !== "admin") // hide admins
  );

  // Promote user to manager
  const promoteUser = async (id) => {
    try {
      const res = await axios.put(
        `/promote/${id}`,
        { role: "manager" },
        { withCredentials: true }
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, role: { ...u.role, name: res.data.newRole } } : u
          )
        );
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to promote user");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await axios.delete(`/users/${id}`, { withCredentials: true });
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (!users || users.length === 0) return <div>No users found.</div>;

  return (
    <div>
      <h3>All Users</h3>
      <table className="table table-hover">
        <thead className="table-secondary">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger me-2"
                  onClick={() => deleteUser(u._id)}
                >
                  Delete
                </button>
                {u.role.name === "user" && (
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => promoteUser(u._id)}
                  >
                    Promote to Manager
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
