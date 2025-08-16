import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const STATUS_COLORS = ["#ffc107", "#17a2b8", "#28a745"]; // Pending, In Progress, Completed
const PRIORITY_COLORS = ["#dc3545", "#ffc107", "#6c757d"]; // High, Medium, Low
const priorityMap = { 1: "High", 2: "Medium", 3: "Low" };

const Analytics = ({ stats }) => {
  if (!stats) return null;

  const statusData = [
    { name: "Pending", value: stats.pendingTasks },
    { name: "In Progress", value: stats.inProgressTasks },
    { name: "Completed", value: stats.completedTasks },
  ];

  const priorityData = stats.tasksByPriority?.map((item) => ({
    name: priorityMap[item._id] || `Priority ${item._id}`,
    value: item.count,
  }));

  return (
    <div
      className="min-vh-80 p-4"
      style={{ background: "linear-gradient(135deg, #1e3c72, #2a5298)" }}
    >
      {/* Hero Section */}
      <div className="text-center text-white mb-5">
        <h1 className="fw-bold">Dashboard</h1>
        <p className="lead">Visualize your task progress and priorities</p>
      </div>

      {/* Cards Section */}
      <div className="row g-4">
        {/* Tasks by Status */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0 p-3" style={{ background: "#c9d5e9" }}>
            <h5 className="card-title text-primary text-center mb-3">Tasks by Status</h5>
            <div className="d-flex align-items-center">
              <PieChart width={250} height={250}>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>

              {/* Status Badges on right */}
              <div className="d-flex flex-column ms-4">
                {statusData.map((s, i) => (
                  <span
                    key={i}
                    className="badge rounded-pill mb-2"
                    style={{ backgroundColor: STATUS_COLORS[i], color: "#fff", padding: "0.6em 1em" }}
                  >
                    {s.name}: {s.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0 p-3" style={{ background: "#c9d5e9" }}>
            <h5 className="card-title text-primary text-center mb-3">Tasks by Priority</h5>
            <div className="d-flex align-items-center">
              <PieChart width={250} height={250}>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>

              {/* Priority Badges on right */}
              <div className="d-flex flex-column ms-4">
                {priorityData.map((p, i) => (
                  <span
                    key={i}
                    className="badge rounded-pill mb-2"
                    style={{ backgroundColor: PRIORITY_COLORS[i], color: "#fff", padding: "0.6em 1em" }}
                  >
                    {p.name}: {p.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
