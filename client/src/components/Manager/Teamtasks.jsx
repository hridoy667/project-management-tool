import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const TeamTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks", { withCredentials: true });
        if (res.data.success) {
          setTasks(res.data.tasks);
        } else {
          setError("Failed to fetch tasks.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading team tasks...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
      <h3>Team Tasks</h3>
      <table className="table table-hover">
        <thead className="table-primary">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="5">No tasks available.</td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.assignedTo?.name || "Unassigned"}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTasks;
