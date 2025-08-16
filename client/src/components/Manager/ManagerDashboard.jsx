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
      <div className="d-flex justify-content-center align-items-center vh-100 w-100" style={{ background: 'linear-gradient(135deg, #1e3c72, #2a5298)' }}>
        <div className="text-center">
          <div className="spinner-border text-light mb-3" role="status" />
          <h3 className="text-white">Loading tasks...</h3>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100" style={{ background: 'linear-gradient(135deg, #1e3c72, #2a5298)' }}>
        <div className="alert alert-danger shadow-lg">{error}</div>
      </div>
    );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header Section */}
      <div className="py-4 px-4" style={{ background: 'linear-gradient(135deg, #1e3c72, #2a5298)' }}>
        <h1 className="text-white fw-bold">Manager Dashboard</h1>
        <p className="text-white-50">View, manage, and update your assigned tasks efficiently</p>
      </div>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Tasks Column */}
          <div className="col-lg-8 mb-4">
            {managerTasks.length === 0 ? (
              <div className="alert alert-info shadow-sm">
                No tasks assigned to you yet.
              </div>
            ) : (
              managerTasks.map(task => (
                <div key={task._id} className="mb-4">
                  <div className="card shadow-lg border-0" style={{ backgroundColor: '#c9d5e9' }}>
                    <div className="card-body">
                      <ManagerTaskForm
                        task={task}
                        onUpdate={handleDependencyUpdate}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column / Instructions */}
          <div className="col-lg-4">
            <div className="card shadow-lg border-0 mb-4" style={{ backgroundColor: '#c9d5e9' }}>
              <div className="card-body">
                <h5 className="fw-bold text-primary">Instructions</h5>
                <ul className="list-unstyled mt-3">
                  <li className="mb-2">
                    <span className="badge rounded-pill bg-primary me-2">•</span>
                    Update task dependencies here.
                  </li>
                  <li className="mb-2">
                    <span className="badge rounded-pill bg-primary me-2">•</span>
                    Assign users to tasks assigned to you.
                  </li>
                  <li className="mb-2">
                    <span className="badge rounded-pill bg-primary me-2">•</span>
                    Other fields (title, description, priority, dates) are read-only.
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Stats / Tips Card */}
            <div className="card shadow-lg border-0" style={{ backgroundColor: '#c9d5e9' }}>
              <div className="card-body">
                <h6 className="fw-bold text-primary">Quick Tips</h6>
                <div className="d-flex flex-column gap-2 mt-2">
                  <div className="alert alert-warning p-2 mb-0">
                    High priority tasks appear in <span className="badge bg-danger">Red</span>.
                  </div>
                  <div className="alert alert-info p-2 mb-0">
                    Medium priority tasks appear in <span className="badge bg-warning text-dark">Yellow</span>.
                  </div>
                  <div className="alert alert-secondary p-2 mb-0">
                    Low priority tasks appear in <span className="badge bg-secondary">Gray</span>.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ManagerDashboard;
