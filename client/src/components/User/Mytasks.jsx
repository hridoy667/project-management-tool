// MyTasks.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const priorityMap = {
  1: "High",
  2: "Medium",
  3: "Low",
};

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusChanges, setStatusChanges] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [savingStatusId, setSavingStatusId] = useState(null);
  const [postingCommentId, setPostingCommentId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/my-tasks", { withCredentials: true });
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

  const handleSaveStatus = async (taskId) => {
    const newStatus = statusChanges[taskId];
    if (!newStatus) return;

    setSavingStatusId(taskId);
    try {
      const res = await axios.put(
        `/my-tasks/${taskId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status.");
    } finally {
      setSavingStatusId(null);
    }
  };

  const handlePostComment = async (taskId) => {
    const commentText = commentInputs[taskId]?.trim();
    if (!commentText) return;

    setPostingCommentId(taskId);
    try {
      const res = await axios.post(
        `/my-tasks/${taskId}/comments`,
        { text: commentText },
        { withCredentials: true }
      );
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId
              ? { ...task, comments: [...(task.comments || []), res.data.comment] }
              : task
          )
        );
        setCommentInputs((prev) => ({ ...prev, [taskId]: "" }));
      }
    } catch (err) {
      console.error("Comment post failed:", err);
      alert("Failed to post comment.");
    } finally {
      setPostingCommentId(null);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div
      className="py-5"
      style={{
        // 
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <h2 className="text-black fw-bold mb-5 text-center">My Tasks</h2>
        <div className="row g-4">
          {tasks.length === 0 && (
            <div className="col-12">
              <div className="alert alert-light text-center">
                No tasks assigned.
              </div>
            </div>
          )}

          {tasks.map((task) => (
            <div key={task._id} className="col-md-6 col-lg-4">
              <div
                className="card shadow-lg border-0 h-100 text-white"
                style={{ background: "linear-gradient(135deg, #1e3c72, #2a5298)", }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-white fw-bold">{task.title}</h5>
                  <p className="card-text text-secondary">{task.description}</p>

                  {/* Priority */}
                  <p className="mb-1">
                    <strong>Priority:</strong>{" "}
                    <span
                      className="badge rounded-pill py-1 px-2"
                      style={{
                        backgroundColor:
                          task.priority === 1
                            ? "#dc3545"
                            : task.priority === 2
                              ? "#ffc107"
                              : "#6c757d",
                        color: task.priority === 2 ? "#000" : "#fff",
                      }}
                    >
                      {priorityMap[task.priority]}
                    </span>
                  </p>

                  {/* Dependencies */}
                  <p className="mb-1">
                    <strong>Dependencies:</strong>{" "}
                    {task.dependencies?.length
                      ? task.dependencies.map((d) => d.title).join(", ")
                      : "None"}
                  </p>

                  {/* Objectives */}
                  {task.objectivesText && (
                    <p className="mb-2">
                      <strong>Objectives:</strong> {task.objectivesText}
                    </p>
                  )}

                  {/* Assigned Users */}
                  <p className="mb-3">
                    <strong>Assigned Users:</strong>{" "}
                    {task.assignedUsers?.length
                      ? task.assignedUsers.map((u) => u.name).join(", ")
                      : "None"}
                  </p>


                  {/* Status */}
                  <div className="mb-3 mt-auto">
                    <label className="form-label fw-bold">Status</label>
                    <select
                      className="form-select"
                      style={{ backgroundColor: "#2a3b5c", color: "#ffffff" }}
                      value={statusChanges[task._id] || task.status}
                      onChange={(e) =>
                        setStatusChanges((prev) => ({
                          ...prev,
                          [task._id]: e.target.value,
                        }))
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      className="btn mt-2"
                      style={{
                        backgroundColor: "#1e3c72",
                        color: "#fff",
                        width: "100%",
                      }}
                      onClick={() => handleSaveStatus(task._id)}
                      disabled={savingStatusId === task._id}
                    >
                      {savingStatusId === task._id ? "Saving..." : "Save Status"}
                    </button>
                  </div>

                  {/* Comments */}
                  <div className="mt-3">
                    <h6 className="fw-bold">Comments</h6>
                    <div
                      style={{
                        maxHeight: "150px",
                        overflowY: "auto",
                        background: "#2a3b5c",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      {task.comments?.length ? (
                        task.comments.map((c, idx) => (
                          <div key={idx} className="mb-2">
                            <strong className="text-white">
                              {c.user?.name || "User"}:
                            </strong>{" "}
                            <span className="text-white">{c.text}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-light mb-0">No comments yet.</p>
                      )}
                    </div>

                    <div className="input-group mt-2">
                      <input
                        type="text"
                        className="form-control"

                        placeholder="Add a comment..."
                        value={commentInputs[task._id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [task._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="btn btn-outline-light"
                        onClick={() => handlePostComment(task._id)}
                        disabled={postingCommentId === task._id}
                      >
                        {postingCommentId === task._id ? "Posting..." : "Send"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
