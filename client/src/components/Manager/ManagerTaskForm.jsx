import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const priorityMap = {
  1: "High Priority",
  2: "Medium Priority",
  3: "Low Priority",
};

const ManagerTaskForm = ({ task, onUpdate }) => {
  const [dependencies, setDependencies] = useState(task.dependencies || []);
  const [assignedUsers, setAssignedUsers] = useState(task.assignedUsers || []);
  const [allTasks, setAllTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(task.dependencies.length === 0); // show editor only if no dependencies yet

  useEffect(() => {
    const fetchTasksAndUsers = async () => {
      try {
        const resTasks = await axios.get("/tasks", { withCredentials: true });
        if (resTasks.data.success) setAllTasks(resTasks.data.tasks);

        const resUsers = await axios.get("/users", { withCredentials: true });
        if (resUsers.data.users) {
          setUsers(resUsers.data.users.filter(u => u.role.name === "user"));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasksAndUsers();
  }, []);

  // Handle dependency checkboxes
  const handleCheckboxChange = (taskId) => {
    setDependencies(prev =>
      prev.includes(taskId) ? prev.filter(d => d !== taskId) : [...prev, taskId]
    );
  };

  // Handle assigned users checkboxes
  const toggleUser = (userId) => {
    setAssignedUsers(prev =>
      prev.includes(userId) ? prev.filter(u => u !== userId) : [...prev, userId]
    );
  };

  // Save both dependencies and assigned users in a single API call
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `/tasks/${task._id}/update`,
        { dependencies, assignedUsers },
        { withCredentials: true }
      );
      if (res.data.success) {
        onUpdate(res.data.task);
        alert("Task updated successfully!");
        setEditing(false);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update task");
    }
    setSaving(false);
  };

  return (
    <div className="card p-3 mb-4">
      <h5>{task.title}</h5>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Priority:</strong> {priorityMap[task.priority]}</p>
      <p><strong>Start:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
      <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>

      {/* Dependencies */}
      <div className="mb-3">
        <label className="form-label"><strong>Dependencies</strong></label>
        <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", padding: "8px", borderRadius: "5px" }}>
          {allTasks.length > 0 ? (
            allTasks.map(t => (
              <div key={t._id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`dep-${t._id}`}
                  value={t._id}
                  checked={dependencies.includes(t._id)}
                  onChange={() => handleCheckboxChange(t._id)}
                  disabled={t._id === task._id} // cannot depend on itself
                />
                <label className="form-check-label" htmlFor={`dep-${t._id}`}>
                  {t.title} ({priorityMap[t.priority]})
                </label>
              </div>
            ))
          ) : (
            <p className="text-muted">No tasks available for dependencies.</p>
          )}
        </div>
      </div>

      {/* Assign Users */}
      <div className="mb-3">
        <h6>Assign Users</h6>
        <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", padding: "8px", borderRadius: "5px" }}>
          {users.map(u => (
            <div key={u._id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`user-${u._id}`}
                value={u._id}
                checked={assignedUsers.includes(u._id)}
                onChange={() => toggleUser(u._id)}
              />
              <label className="form-check-label" htmlFor={`user-${u._id}`}>
                {u.name} ({u.email})
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        className="btn btn-primary mt-2"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default ManagerTaskForm;
