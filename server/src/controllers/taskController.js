const Task = require('../models/Taskmodel');

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dependencies, startDate, dueDate } = req.body;

    const userRole = req.user.role.name;

    // Users cannot create tasks
    if (userRole === 'user') {
      return res.status(403).json({ success: false, message: 'Users cannot create tasks' });
    }

    // Admin can assign only to managers
    if (userRole === 'admin' && assignedTo) {
      const assignee = await require('../models/Usermodel').findById(assignedTo).populate('role', 'name');
      if (!assignee || assignee.role.name !== 'manager') {
        return res.status(403).json({ success: false, message: 'Admin can assign tasks only to managers' });
      }
    }

    // Manager can assign only to users
    if (userRole === 'manager' && assignedTo) {
      const assignee = await require('../models/Usermodel').findById(assignedTo).populate('role', 'name');
      if (!assignee || assignee.role.name !== 'user') {
        return res.status(403).json({ success: false, message: 'Manager can assign tasks only to users' });
      }
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      priority,
      dependencies: [],
      startDate,
      dueDate
    });

    // Handle dependencies (optional)
    if (dependencies && dependencies.length > 0) {
      if (dependencies.includes(task._id.toString())) {
        await Task.findByIdAndDelete(task._id); // rollback
        return res.status(400).json({ success: false, message: 'Task cannot depend on itself' });
      }
      const conflictingTasks = await Task.find({ _id: { $in: dependencies }, dependencies: task._id });
      if (conflictingTasks.length > 0) {
        await Task.findByIdAndDelete(task._id); // rollback
        return res.status(400).json({ success: false, message: 'Direct circular dependency detected' });
      }

      task.dependencies = dependencies;
      await task.save();
    }

    res.status(201).json({ success: true, message: 'Task created', task });

  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Failed to create task', error: error.toString() });
  }
};


// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const { search, priority } = req.query;

    let query = {};

    const userId = req.user._id;
    const userRole = req.user.role.name;

    if (userRole === 'user') {
      // Include tasks assigned directly to them or in assignedUsers array
      query = {
        $or: [
          { assignedTo: userId },
          { assignedUsers: userId }
        ]
      };
    }

    // Search by title or description
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Filter by priority
    if (priority) {
      query.$and = query.$and || [];
      query.$and.push({ priority: Number(priority) });
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedUsers', 'name email')
      .populate('dependencies', 'title');

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Failed to fetch tasks', error: error.toString() });
  }
};

// controllers/taskControllers.js
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId)
      .populate("assignedTo", "name email") // manager assigned by admin
      .populate("dependencies", "title");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      task: {
        _id: task._id,
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        status: task.status,
        priority: task.priority,
        dependencies: task.dependencies,
        startDate: task.startDate,
        dueDate: task.dueDate,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const userRole = req.user.role.name;
    if (userRole === 'user') {
      return res.status(403).json({ success: false, message: 'Not authorized to update task' });
    }

    if (userRole === 'manager') {
      if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Managers can update only assigned tasks' });
      }
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: 'Task updated', task: updatedTask });

  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Failed to update task', error: error.toString() });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Only Admin can delete
    if (req.user.role.name !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admin can delete tasks' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted' });

  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Failed to delete task', error: error.toString() });
  }
};

/// Get dashboard data based on user role
exports.getDashboardData = async (req, res) => {
  try {
    const userRole = req.user.role.name;
    let tasks = [];
    let users = [];
    let stats = {};

    // User: only their tasks
    if (userRole === 'user') {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedTo', 'name email')
        .populate('dependencies', 'title');
    }

    // Manager: all tasks + summary stats
    if (userRole === 'manager') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('dependencies', 'title');

      stats.totalTasks = await Task.countDocuments();
      stats.pendingTasks = await Task.countDocuments({ status: 'pending' });
      stats.inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
      stats.completedTasks = await Task.countDocuments({ status: 'completed' });
    }

    // Admin: all tasks + all users + summary stats
    if (userRole === 'admin') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('dependencies', 'title');

      users = await require('../models/Usermodel').find()
        .populate('role', 'name');

      stats.totalTasks = await Task.countDocuments();
      stats.pendingTasks = await Task.countDocuments({ status: 'pending' });
      stats.inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
      stats.completedTasks = await Task.countDocuments({ status: 'completed' });

      stats.tasksByPriority = await Task.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } }
      ]);
    }

    res.status(200).json({
      success: true,
      user: { name: req.user.name, role: userRole },
      tasks,
      users,
      stats
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard data", error: error.toString() });
  }
};

exports.getAssignedTasks = async (req, res) => {
  try {
    const managerId = req.user._id;

    const tasks = await Task.find({ assignedTo: managerId })
      .populate("assignedTo", "name email role")
      .populate("dependencies", "title priority")
      .populate("assignedUsers", "name email") // optional if you want user names
      .populate("comments.user", "name"); // <-- populate comments

    res.json({ success: true, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};


exports.updateDependencies = async (req, res) => {
  try {
    const managerId = req.user._id;
    const { taskId } = req.params;
    let { dependencies } = req.body;

    const task = await Task.findById(taskId);
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    // Only assigned manager can update dependencies
    if (!task.assignedTo.equals(managerId)) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Remove duplicates
    dependencies = [...new Set(dependencies)];

    // Prevent a task from depending on itself
    dependencies = dependencies.filter(depId => depId !== taskId);

    task.dependencies = dependencies;
    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update dependencies" });
  }
};



exports.assignUserToTask = async (req, res) => {
  try {
    const managerId = req.user._id;
    const { taskId } = req.params;
    const { userId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // Only assigned manager can assign users to this task
    if (!task.assignedTo.equals(managerId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const user = await user.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Here you can store assigned users in a separate array if needed, or create a TaskUser model
    // For simplicity, let's add to dependencies if not already present
    if (!task.dependencies.includes(userId)) {
      task.dependencies.push(userId);
      await task.save();
    }

    res.json({ success: true, message: "User assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to assign user" });
  }
};

// controllers/taskController.js
exports.updateDependenciesAndUsers = async (req, res) => {
  try {
    const managerId = req.user._id;
    const { taskId } = req.params;
    let { dependencies = [], assignedUsers = [], objectivesText = '' } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    if (!task.assignedTo.equals(managerId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Remove duplicates & prevent task depending on itself
    dependencies = [...new Set(dependencies)].filter(d => d !== taskId);
    assignedUsers = [...new Set(assignedUsers)];

    task.dependencies = dependencies;
    task.assignedUsers = assignedUsers;
    task.objectivesText = objectivesText; // <-- NEW

    await task.save();

    res.json({ success: true, message: "Task updated successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
};

