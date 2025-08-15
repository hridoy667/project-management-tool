import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FaChevronDown, FaChevronUp, FaEdit, FaAngleDown, FaAngleUp, FaPaperPlane } from "react-icons/fa";

const priorityMap = {
  1: "High Priority",
  2: "Medium Priority",
  3: "Low Priority",
};

const ManagerTaskForm = ({ task, onUpdate }) => {
  const [dependencies, setDependencies] = useState(task.dependencies || []);
  const [assignedUsers, setAssignedUsers] = useState(task.assignedUsers || []);
  const [objectivesText, setObjectivesText] = useState(task.objectivesText || '');
  const [allTasks, setAllTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [showDependencies, setShowDependencies] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchTasksAndUsers = async () => {
      try {
        const resTasks = await axios.get("/tasks", { withCredentials: true });
        if (resTasks.data.success) setAllTasks(resTasks.data.tasks);

        const resUsers = await axios.get("/users", { withCredentials: true });
        if (resUsers.data.users) {
          setUsers(resUsers.data.users.filter(u => u.role.name === "user"));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasksAndUsers();
  }, []);

  useEffect(() => {
    // Check if any changes were made
    const changesExist = 
      JSON.stringify(dependencies) !== JSON.stringify(task.dependencies) ||
      JSON.stringify(assignedUsers) !== JSON.stringify(task.assignedUsers) ||
      objectivesText !== task.objectivesText;
    
    setHasChanges(changesExist);
  }, [dependencies, assignedUsers, objectivesText, task]);

  const handleCheckboxChange = (taskId) => {
    setDependencies(prev =>
      prev.includes(taskId) ? prev.filter(d => d !== taskId) : [...prev, taskId]
    );
  };

  const toggleUser = (userId) => {
    setAssignedUsers(prev =>
      prev.includes(userId) ? prev.filter(u => u !== userId) : [...prev, userId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `/tasks/${task._id}/update`,
        { dependencies, assignedUsers, objectivesText },
        { withCredentials: true }
      );
      if (res.data.success) {
        onUpdate(res.data.task);
        setCollapsed(true);
        setShowDependencies(false);
        setShowAssignments(false);
        setHasChanges(false);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
    setSaving(false);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setShowDependencies(false);
      setShowAssignments(false);
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await axios.post(
        `/tasks/${task._id}/comments`,
        { text: newComment },
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setComments([...comments, res.data.comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
    setCommentLoading(false);
  };

  const renderDescription = () => {
    if (!task.description) return null;
    
    const maxLines = 3;
    const lines = task.description.split('\n');
    const shouldTruncate = lines.length > maxLines && !showFullDescription;

    return (
      <div className="mb-2">
        <strong>Description:</strong>
        <div 
          className={`description-content ${shouldTruncate ? 'truncated' : ''}`}
          style={{
            maxHeight: shouldTruncate ? `${maxLines * 1.5}em` : 'none',
            overflow: 'hidden',
            whiteSpace: 'pre-line'
          }}
        >
          {task.description}
        </div>
        {lines.length > maxLines && (
          <button 
            onClick={toggleDescription} 
            className="btn btn-link p-0 text-decoration-none"
          >
            {showFullDescription ? (
              <><FaAngleUp className="me-1" /> Show less</>
            ) : (
              <><FaAngleDown className="me-1" /> Show more</>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body" style={{ position: "relative" }}>
        {/* Collapsed View */}
        {collapsed ? (
          <>
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text"><strong>Priority:</strong> {priorityMap[task.priority]}</p>
            <p className="card-text"><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            {objectivesText && (
              <p className="card-text"><strong>Objectives:</strong> {objectivesText}</p>
            )}
            {comments.length > 0 && (
              <p className="card-text"><strong>Comments:</strong> {comments.length}</p>
            )}
            <button
              className="btn btn-link position-absolute"
              style={{ bottom: 10, right: 10 }}
              onClick={toggleCollapse}
            >
              <FaChevronDown size={20} />
            </button>
          </>
        ) : (
          <>
            {/* Expanded view with full editing form */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{task.title}</h5>
              <button
                className="btn btn-link"
                onClick={toggleCollapse}
              >
                <FaChevronUp size={20} />
              </button>
            </div>
            
            {renderDescription()}
            <p><strong>Priority:</strong> {priorityMap[task.priority]}</p>
            <p><strong>Start:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
            <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>

            {/* Objectives text field */}
            <div className="mb-3">
              <label className="form-label"><strong>Project Objectives</strong></label>
              <textarea
                className="form-control"
                rows="3"
                value={objectivesText}
                onChange={(e) => setObjectivesText(e.target.value)}
                placeholder="e.g. Ali do folder setup, Mahin do project initialization"
              ></textarea>
            </div>

            {/* Dependencies Section */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label"><strong>Dependencies</strong></label>
                <button 
                  className="btn btn-sm btn-link"
                  onClick={() => setShowDependencies(!showDependencies)}
                >
                  {showDependencies ? 'Hide' : dependencies.length > 0 ? (
                    <>
                      <FaEdit className="me-1" />
                      Edit ({dependencies.length})
                    </>
                  ) : 'Add Dependencies'}
                </button>
              </div>
              
              {showDependencies && (
                <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", padding: "8px", borderRadius: "5px" }}>
                  {allTasks.length > 0 ? (
                    allTasks.map(t => (
                      <div key={t._id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`dep-${t._id}`}
                          value={t._id}
                          checked={dependencies.includes(t._id)}
                          onChange={() => handleCheckboxChange(t._id)}
                          disabled={t._id === task._id}
                        />
                        <label className="form-check-label" htmlFor={`dep-${t._id}`}>
                          {t.title} ({priorityMap[t.priority]})
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No tasks available for dependencies.</p>
                  )}
                </div>
              )}
            </div>

            {/* Assign Users Section */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Assign Users</h6>
                <button 
                  className="btn btn-sm btn-link"
                  onClick={() => setShowAssignments(!showAssignments)}
                >
                  {showAssignments ? 'Hide' : assignedUsers.length > 0 ? (
                    <>
                      <FaEdit className="me-1" />
                      Edit ({assignedUsers.length})
                    </>
                  ) : 'Assign Users'}
                </button>
              </div>
              
              {showAssignments && (
                <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", padding: "8px", borderRadius: "5px" }}>
                  {users.map(u => (
                    <div key={u._id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`user-${u._id}`}
                        value={u._id}
                        checked={assignedUsers.includes(u._id)}
                        onChange={() => toggleUser(u._id)}
                      />
                      <label className="form-check-label" htmlFor={`user-${u._id}`}>
                        {u.name} ({u.email})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="mb-3">
              <h6>Discussion</h6>
              <div className="mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="mb-2 p-2 bg-light rounded">
                      <div className="d-flex justify-content-between">
                        <strong>{comment.user?.name || 'Unknown'}</strong>
                        <small className="text-muted">
                          {new Date(comment.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <p className="mb-0">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No comments yet</p>
                )}
              </div>
              
              <form onSubmit={handleCommentSubmit} className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={commentLoading || !newComment.trim()}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>

            {hasChanges && (
              <button
                className="btn btn-primary w-100"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerTaskForm;