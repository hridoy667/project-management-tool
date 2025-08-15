import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const STATUS_COLORS = ["#ffc107", "#17a2b8", "#28a745"]; // Pending, In Progress, Completed
const PRIORITY_COLORS = ["#dc3545", "#ffc107", "#6c757d"]; // High, Medium, Low
const priorityMap = {
  1: "High",
  2: "Medium",
  3: "Low",
};

const Analytics = ({ stats }) => {
  if (!stats) return null;

  // Prepare data for task status chart
  const statusData = [
    { name: "Pending", value: stats.pendingTasks },
    { name: "In Progress", value: stats.inProgressTasks },
    { name: "Completed", value: stats.completedTasks },
  ];

  // Prepare data for priority chart
  const priorityData = stats.tasksByPriority?.map((item) => ({
    name: priorityMap[item._id] || `Priority ${item._id}`,
    value: item.count,
  }));

  return (
    <div className="mt-4">
      <h3 className="mb-4">Dashboard Analytics</h3>

      <div className="row mb-5">
        <div className="col-md-6 d-flex justify-content-center">
          <div>
            <h5 className="text-center mb-3">Tasks by Status</h5>
            <PieChart width={300} height={300}>
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
          </div>
        </div>

        <div className="col-md-6 d-flex justify-content-center">
          <div>
            <h5 className="text-center mb-3">Tasks by Priority</h5>
            <PieChart width={300} height={300}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
