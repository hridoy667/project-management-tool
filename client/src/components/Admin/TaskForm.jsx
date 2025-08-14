import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const priorityMap = {
  1: "High Priority",
  2: "Medium Priority",
  3: "Low Priority",
};

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users", { withCredentials: true });
        setUsers(res.data.users.filter(u => u.role.name !== "admin"));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks", { withCredentials: true });
        if (res.data.success) setTasks(res.data.tasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchUsers();
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/tasks",
        { title, description, assignedTo, priority, startDate, dueDate, dependencies },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Send both task and updated stats to Dashboard
        onTaskCreated(res.data.task, res.data.stats);

        // Reset form
        setTitle("");
        setDescription("");
        setAssignedTo("");
        setPriority(1);
        setStartDate("");
        setDueDate("");
        setDependencies([]);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5>Create New Task</h5>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Title"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-2">
          <textarea
            placeholder="Description"
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Assign To */}
        <div className="mb-2">
          <select
            className="form-select"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            required
          >
            <option value="">Assign To</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role.name})
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="mb-2">
          <select
            className="form-select"
            value={priority}
            onChange={e => setPriority(Number(e.target.value))}
          >
            {Object.entries(priorityMap).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="mb-2">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            required
          />
        </div>

        {/* Dependencies */}
        <div className="mb-2">
          <label className="form-label">Dependencies</label>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task._id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`dep-${task._id}`}
                  value={task._id}
                  checked={dependencies.includes(task._id)}
                  onChange={(e) => {
                    const id = e.target.value;
                    setDependencies(prev =>
                      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
                    );
                  }}
                />
                <label className="form-check-label" htmlFor={`dep-${task._id}`}>
                  {task.title} ({priorityMap[task.priority]})
                </label>
              </div>
            ))
          ) : (
            <p className="text-muted">No existing tasks to depend on.</p>
          )}
        </div>

        <button className="btn btn-primary">Create Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
