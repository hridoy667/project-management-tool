import React, { useEffect, useState } from "react";
import axios from "../api/axios";

// Import role-specific components
import UsersTable from "../components/Admin/Usertable";
import Analytics from "../components/Admin/Analytics";
import TaskForm from "../components/Admin/TaskForm";
import MyTasks from "../components/User/Mytasks";
import ManagerDashboard from "../components/Manager/ManagerDashboard"; // <-- import new manager dashboard

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/dashboard", { withCredentials: true });
      if (res.data.success) {
        setDashboardData(res.data);
      } else {
        setError("Failed to load dashboard.");
      }
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

  // Callback to update tasks and refresh stats after creating a new task
  const handleTaskCreated = async (newTask) => {
    try {
      setDashboardData(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
      }));

      const res = await axios.get("/dashboard", { withCredentials: true });
      if (res.data.success) {
        setDashboardData(prev => ({
          ...prev,
          stats: res.data.stats,
        }));
      }
    } catch (err) {
      console.error("Failed to update stats after task creation:", err);
    }
  };

  // Callback to update task dependencies (for managers)
  const handleDependenciesUpdated = async (taskId, newDependencies) => {
    try {
      const res = await axios.put(
        `/tasks/${taskId}/dependencies`,
        { dependencies: newDependencies },
        { withCredentials: true }
      );

      if (res.data.success) {
        setDashboardData(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
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
        <h3 className="text-primary">Loading dashboard...</h3>
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        <h3 className="text-danger">{error}</h3>
      </div>
    );

  const { user, tasks, users, stats } = dashboardData;

  return (
    <div className="container-fluid vh-100 w-100 bg-light p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Hello, {user.name}</h1>
        <div>
          <span className="badge bg-secondary fs-6 me-3">{user.role.toUpperCase()}</span>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Render role-specific components */}
      {user.role === "admin" && (
        <>
          <Analytics stats={stats} />
          <TaskForm onTaskCreated={handleTaskCreated} />
          <UsersTable users={users} />
        </>
      )}

      {user.role === "manager" && (
        <ManagerDashboard tasks={tasks} onDependenciesUpdated={handleDependenciesUpdated} />
      )}

      {user.role === "user" && <MyTasks tasks={tasks} />}
    </div>
  );
};

export default Dashboard;
