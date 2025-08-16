import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const TaskView = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/tasks/${id}`, { withCredentials: true });
        if (res.data.success) {
          setTask(res.data.task);
        } else {
          setError("Task not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch task.");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <div className="spinner-border text-primary mt-5 d-block mx-auto" />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!task) return null;

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-primary mb-3" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="card shadow-lg p-4" style={{ background: "#c9d5e9" }}>
        <h2 className="text-primary fw-bold">{task.title}</h2>
        <p className="text-secondary">{task.description}</p>

        <p>
          <strong>Priority:</strong>{" "}
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
            {task.priority === 1
              ? "High Priority"
              : task.priority === 2
              ? "Medium Priority"
              : "Low Priority"}
          </span>
        </p>

        <p>
          <strong>Status:</strong>{" "}
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
        </p>

        <p>
          <strong>Assigned To:</strong>{" "}
          {task.assignedTo ? task.assignedTo.name : "None"}
        </p>

        <p>
          <strong>Start Date:</strong> {task.startDate?.slice(0, 10) || "N/A"}
        </p>
        <p>
          <strong>Due Date:</strong> {task.dueDate?.slice(0, 10) || "N/A"}
        </p>

        {task.dependencies?.length > 0 && (
          <p>
            <strong>Dependencies:</strong> {task.dependencies.map((d) => d.title).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskView;
