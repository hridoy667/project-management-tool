const Task = require('../../models/Taskmodel');

// Get all tasks assigned to the logged-in user
exports.getAssignedTasks = async (req, res) => {
  try {
    // Only allow users to access
    if (req.user.role.name !== 'user') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Fetch tasks assigned to this user
    const tasks = await Task.find({ assignedUsers: req.user._id })
      .populate('assignedUsers', 'name email')
      .populate('dependencies', 'title')
      .populate({ path: 'comments.user', select: 'name role' }); // <-- populate comment user

    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


// Update status of a task (only user can update status)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Find the task assigned to this user
    const task = await Task.findOne({ _id: taskId, assignedUsers: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /my-tasks/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const taskId = req.params.id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    // Find the task depending on user/manager role
    let task;
    if (req.user.role.name === "user") {
      task = await Task.findOne({ _id: taskId, assignedUsers: req.user._id });
    } else if (req.user.role.name === "manager") {
      task = await Task.findById(taskId);
    }

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found or not assigned to you" });
    }

    const comment = {
      user: req.user._id,
      text: text.trim(),
    };

    task.comments.push(comment);
    await task.save();

    // Populate the user field of **all comments** from the parent document
    await Task.populate(task, { path: "comments.user", select: "name role" });

    // Send only the newly added comment
    const newComment = task.comments[task.comments.length - 1];

    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
