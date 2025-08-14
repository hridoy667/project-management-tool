const Task = require('../models/Taskmodel');

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dependencies, startDate, dueDate } = req.body;

    // Users cannot assign tasks to others
    if (assignedTo && req.user.role.name === 'user') {
      return res.status(403).json({ success: false, message: 'Users cannot assign tasks' });
    }

    // Create task first (dependencies will be set after checks)
    const task = await Task.create({ 
      title, 
      description, 
      assignedTo, 
      priority, 
      dependencies: [], 
      startDate, 
      dueDate 
    });

    // Prevent self-dependency
    if (dependencies && dependencies.includes(task._id.toString())) {
      await Task.findByIdAndDelete(task._id); // rollback
      return res.status(400).json({ success: false, message: 'Task cannot depend on itself' });
    }

    // Optional: prevent direct two-way dependency (simple circular check)
    if (dependencies && dependencies.length > 0) {
      const conflictingTasks = await Task.find({ _id: { $in: dependencies }, dependencies: task._id });
      if (conflictingTasks.length > 0) {
        await Task.findByIdAndDelete(task._id); // rollback
        return res.status(400).json({ success: false, message: 'Direct circular dependency detected' });
      }

      // Save valid dependencies
      task.dependencies = dependencies;
      await task.save();
    }

    // Emit task created event via Socket.IO
    req.io.emit('taskCreated', task);

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

    // Normal users see only their tasks
    if (req.user.role.name === 'user') {
      query.assignedTo = req.user._id;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by priority
    if (priority) query.priority = Number(priority);

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('dependencies', 'title');

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Failed to fetch tasks', error: error.toString() });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Only admin/manager can update tasks
    if (req.user.role.name === 'user') {
      return res.status(403).json({ success: false, message: 'Not authorized to update task' });
    }

    // Prevent self-dependency
    if (req.body.dependencies && req.body.dependencies.includes(task._id.toString())) {
      return res.status(400).json({ success: false, message: 'Task cannot depend on itself' });
    }

    // Optional: prevent direct two-way dependency
    if (req.body.dependencies && req.body.dependencies.length > 0) {
      const conflictingTasks = await Task.find({ _id: { $in: req.body.dependencies }, dependencies: task._id });
      if (conflictingTasks.length > 0) {
        return res.status(400).json({ success: false, message: 'Direct circular dependency detected' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Emit task updated event via Socket.IO
    req.io.emit('taskUpdated', updatedTask);

    res.status(200).json({ success: true, message: 'Task updated', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Failed to update task', error: error.toString() });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    // Only admin can delete
    if (req.user.role.name !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admin can delete tasks' });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Emit task deleted event via Socket.IO
    req.io.emit('taskDeleted', task);

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Failed to delete task', error: error.toString() });
  }
};

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
      const totalTasks = await Task.countDocuments();
      const pendingTasks = await Task.countDocuments({ status: 'pending' });
      const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
      const completedTasks = await Task.countDocuments({ status: 'completed' });
  
      const tasksByPriority = await Task.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } }
      ]);
  
      res.status(200).json({
        success: true,
        stats: {
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          tasksByPriority
        }
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: "Failed to fetch stats", error: error.toString() });
    }
  };
  