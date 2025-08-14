import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const priorityMap = {
  1: "High Priority",
  2: "Medium Priority",
  3: "Low Priority",
};

const ManagerTaskForm = ({ task, onUpdate }) => {
  const [dependencies, setDependencies] = useState(task.dependencies || []);
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

  const handleCheckboxChange = (taskId) => {
    setDependencies(prev =>
      prev.includes(taskId) ? prev.filter(d => d !== taskId) : [...prev, taskId]
    );
  };

  const handleSaveDependencies = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `/tasks/${task._id}/dependencies`,
        { dependencies },
        { withCredentials: true }
      );
      if (res.data.success) {
        onUpdate(res.data.task);
        alert("Dependencies saved successfully!");
        setEditing(false); // hide after save
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to save dependencies");
    }
    setSaving(false);
  };

  const handleAssignUser = async (userId) => {
    try {
      const res = await axios.put(
        `/tasks/${task._id}/assign-user`,
        { userId },
        { withCredentials: true }
      );
      if (res.data.success) alert("User assigned successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
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
        {editing ? (
          <>
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
            <button
              className="btn btn-primary mt-2"
              onClick={handleSaveDependencies}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Dependencies"}
            </button>
          </>
        ) : (
          <button className="btn btn-secondary mt-2" onClick={() => setEditing(true)}>
            Edit Dependencies
          </button>
        )}
      </div>

      {/* Assign Users */}
      <div className="mb-3">
        <h6>Assign Users to this Task</h6>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAssignUser(u._id)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerTaskForm;
