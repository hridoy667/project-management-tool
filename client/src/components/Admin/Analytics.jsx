import React from "react";

const priorityMap = {
  1: "High",
  2: "Medium",
  3: "Low",
};

const Analytics = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="mt-4">
      <h3 className="mb-3">Dashboard Analytics</h3>
      <div className="row">
        {/* Total Tasks */}
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5>Total Tasks</h5>
              <p className="fs-4">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5>Pending</h5>
              <p className="fs-4">{stats.pendingTasks}</p>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5>In Progress</h5>
              <p className="fs-4">{stats.inProgressTasks}</p>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5>Completed</h5>
              <p className="fs-4">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks by Priority */}
      <div className="mt-4">
        <h5>Tasks by Priority</h5>
        <div className="row">
          {stats.tasksByPriority && stats.tasksByPriority.length > 0 ? (
            stats.tasksByPriority.map((item) => (
              <div key={item._id} className="col-md-3 mb-3">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <h6>{priorityMap[item._id] || `Priority ${item._id}`}</h6>
                    <p className="fs-5">{item.count}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="ms-3">No priority data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
