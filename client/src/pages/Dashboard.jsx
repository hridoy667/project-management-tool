import React, { useEffect, useState } from "react";
import axios from "../api/axios";

// Import role-specific components
import UsersTable from "../components/Admin/Usertable";
import Analytics from "../components/Admin/Analytics";
import TaskForm from "../components/Admin/TaskForm";
import AdminTaskTable from "../components/Admin/AdminTaskTable"; // <-- New
import MyTasks from "../components/User/Mytasks";
import ManagerDashboard from "../components/Manager/ManagerDashboard";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/dashboard", { withCredentials: true });
      if (res.data.success) setDashboardData(res.data);
      else setError("Failed to load dashboard.");
    } catch (err) {
      console.error("Dashboard fetch error:", err.response?.data || err.message);
      setError("Failed to load dashboard.");
    }
  };

  useEffect(() => {
    fetchDashboardData().finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleTaskCreated = async (newTask) => {
    try {
      setDashboardData((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
      }));
      const res = await axios.get("/dashboard", { withCredentials: true });
      if (res.data.success) {
        setDashboardData((prev) => ({
          ...prev,
          stats: res.data.stats,
        }));
      }
    } catch (err) {
      console.error("Failed to update stats after task creation:", err);
    }
  };

  const handleDependenciesUpdated = async (taskId, newDependencies) => {
    try {
      const res = await axios.put(
        `/tasks/${taskId}/dependencies`,
        { dependencies: newDependencies },
        { withCredentials: true }
      );
      if (res.data.success) {
        setDashboardData((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task._id === taskId ? { ...task, dependencies: newDependencies } : task
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to update dependencies:", err);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        <div className="spinner-border text-white" role="status" />
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  const { user, tasks, users, stats } = dashboardData;

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 text-white">
        <div>
          <h1 className="fw-bold">{`Hello, ${user.name}`}</h1>
          <span
            className="badge rounded-pill text-white fw-bold"
            style={{ backgroundColor: "#0f2145", fontSize: "1rem" }}
          >
            {user.role.toUpperCase()}
          </span>
        </div>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Dashboard Body */}
      <div className="container-fluid">
        {user.role === "admin" && (
          <>
            {/* Analytics */}
            <div className="row mb-4">
              <div className="col-12">
                <Analytics
                  stats={stats}
                  cardStyle={{
                    background: "#c9d5e9",
                    color: "#1e3c72",
                    shadow: "shadow-lg",
                  }}
                />
              </div>
            </div>

            {/* Task Table */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow-lg border-0 p-3" style={{ background: "#c9d5e9" }}>
                  <h5 className="text-primary mb-3">All Tasks</h5>
                  <AdminTaskTable tasks={tasks} />
                </div>
              </div>
            </div>

            {/* Task Form & Users Table */}
            <div className="row mb-4">
              <div className="col-lg-6 mb-3">
                <TaskForm onTaskCreated={handleTaskCreated} />
              </div>
              <div className="col-lg-6 mb-3">
                <div className="card shadow-lg border-0 p-3" style={{ background: "#c9d5e9" }}>
                  <h5 className="mb-3 text-primary">Users</h5>
                  <UsersTable users={users} />
                </div>
              </div>
            </div>
          </>
        )}

        {user.role === "manager" && (
          <div className="row">
            <div className="col-12">
              <ManagerDashboard tasks={tasks} onDependenciesUpdated={handleDependenciesUpdated} />
            </div>
          </div>
        )}

        {user.role === "user" && (
          <div className="row">
            <div className="col-12">
              <div className="card shadow-lg border-0 p-3" style={{ background: "#c9d5e9" }}>
                
                <MyTasks tasks={tasks} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        className="text-white text-center mt-5 p-3"
        style={{ backgroundColor: "#0f2145", borderRadius: "0.5rem" }}
      >
        &copy; 2025 Taskly. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
