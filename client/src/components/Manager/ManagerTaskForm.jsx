import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const priorityMap = {
  1: "High Priority",
  2: "Medium Priority",
  3: "Low Priority",
};

// components/ManagerTaskForm.jsx
const ManagerTaskForm = ({ task, onUpdate }) => {
  const [dependencies, setDependencies] = useState(task.dependencies || []);
  const [assignedUsers, setAssignedUsers] = useState(task.assignedUsers || []);
  const [objectivesText, setObjectivesText] = useState(task.objectivesText || ''); // <-- NEW
  const [allTasks, setAllTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(task.dependencies.length === 0); 
  const [collapsed, setCollapsed] = useState(task.dependencies.length > 0);

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

  const toggleUser = (userId) => {
    setAssignedUsers(prev =>
      prev.includes(userId) ? prev.filter(u => u !== userId) : [...prev, userId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `/tasks/${task._id}/update`,
        { dependencies, assignedUsers, objectivesText }, // <-- INCLUDE
        { withCredentials: true }
      );
      if (res.data.success) {
        onUpdate(res.data.task);
        alert("Task updated successfully!");
        setEditing(false);
        setCollapsed(true);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update task");
    }
    setSaving(false);
  };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body" style={{ position: "relative" }}>
        {collapsed && !editing ? (
          <>
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text"><strong>Priority:</strong> {priorityMap[task.priority]}</p>
            <p className="card-text"><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            {task.objectivesText && (
              <p className="card-text"><strong>Objectives:</strong> {task.objectivesText}</p>
            )}
            <button
              className="btn btn-link position-absolute"
              style={{ bottom: 10, right: 10 }}
              onClick={() => { setCollapsed(false); setEditing(true); }}
            >
              <FaChevronDown size={20} />
            </button>
          </>
        ) : (
          <>
            <h5>{task.title}</h5>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Priority:</strong> {priorityMap[task.priority]}</p>
            <p><strong>Start:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
            <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>

            {/* Objectives text field */}
            <div className="mb-3">
              <label className="form-label"><strong>Project Objectives</strong></label>
              <textarea
                className="form-control"
                rows="3"
                value={objectivesText}
                onChange={(e) => setObjectivesText(e.target.value)}
                placeholder="e.g. Ali do folder setup, Mahin do project initialization"
              ></textarea>
            </div>

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
                        disabled={t._id === task._id}
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

            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                className="btn btn-link"
                onClick={() => setCollapsed(true)}
              >
                <FaChevronUp size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default ManagerTaskForm;
