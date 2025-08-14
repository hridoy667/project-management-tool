import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import ManagerTaskForm from "../Manager/ManagerTaskForm";

const ManagerDashboard = () => {
  const [managerTasks, setManagerTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all tasks assigned to this manager
  const fetchManagerTasks = async () => {
    try {
      const res = await axios.get("/tasks/assigned", { withCredentials: true });
      if (res.data.success) {
        setManagerTasks(res.data.tasks);
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

  useEffect(() => {
    fetchManagerTasks();
  }, []);

  // Callback when dependencies are updated
  const handleDependencyUpdate = (updatedTask) => {
    setManagerTasks(prev =>
      prev.map(t => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        <h3 className="text-primary">Loading tasks...</h3>
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        <h3 className="text-danger">{error}</h3>
      </div>
    );

  return (
    <div className="container-fluid vh-100 w-100 bg-light p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Manager Dashboard</h1>
        
      </div>

      {managerTasks.length === 0 ? (
        <p>No tasks assigned to you yet.</p>
      ) : (
        <div className="row">
          {/* Tasks Column */}
          <div className="col-md-8">
            {managerTasks.map(task => (
              <ManagerTaskForm
                key={task._id}
                task={task}
                onUpdate={handleDependencyUpdate} 
              />
            ))}
          </div>

          {/* Right Column for instructions */}
          <div className="col-md-4">
            <div className="card p-3">
              <h5>Instructions</h5>
              <ul>
                <li>You can update task dependencies here.</li>
                <li>You can assign users to tasks assigned to you.</li>
                <li>Other fields (title, description, priority, dates) are read-only.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
