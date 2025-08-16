import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const priorityMap = { 1: "High Priority", 2: "Medium Priority", 3: "Low Priority" };

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // for search
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks", { withCredentials: true });
      if (res.data.success) {
        setTasks(res.data.tasks);
        setFilteredTasks(res.data.tasks);
      } else setError("Failed to fetch tasks.");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle delete
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await axios.delete(`/tasks/${taskId}`, { withCredentials: true });
      if (res.data.success) {
        const updatedTasks = tasks.filter((t) => t._id !== taskId);
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks.filter((t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        alert("Task deleted successfully");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = tasks.filter((t) =>
      t.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">All Tasks</h3>

      {/* Search field */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search tasks by title..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="alert alert-info">No tasks found.</div>
      ) : (
        <div
          className="table-responsive"
          style={{ maxHeight: "500px", overflowY: "auto", background: "#c9d5e9", borderRadius: "8px" }}
        >
          <table className="table table-hover mb-0">
            <thead className="sticky-top" style={{ background: "#1e3c72", color: "#fff" }}>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id}>
                  <td className="text-primary fw-bold">{task.title}</td>
                  <td>
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor:
                          task.priority === 1
                            ? "#dc3545"
                            : task.priority === 2
                            ? "#ffc107"
                            : "#6c757d",
                        color: "#fff",
                      }}
                    >
                      {priorityMap[task.priority]}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor:
                          task.status === "pending"
                            ? "#ffc107"
                            : task.status === "in-progress"
                            ? "#17a2b8"
                            : "#28a745",
                        color: "#fff",
                      }}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>{task.assignedUsers?.map((u) => u.name).join(", ") || "None"}</td>
                  <td>{task.startDate?.slice(0, 10) || "N/A"}</td>
                  <td>{task.dueDate?.slice(0, 10) || "N/A"}</td>
                  <td className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/tasks/${task._id}`)}
                    >
                      See Project
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
