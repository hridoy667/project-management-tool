const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const {
  getAssignedTasks,
  updateTaskStatus,
  addComment
} = require('../controllers/UserTaskController/userTaskController');

// Get all tasks assigned to logged-in user
router.get('/my-tasks', isAuthenticated, authorizeRoles('user'), getAssignedTasks);

// Update task status
router.put('/my-tasks/:taskId/status', isAuthenticated, authorizeRoles('user'), updateTaskStatus);

// Add comment to task
router.post('/my-tasks/:id/comments', isAuthenticated, authorizeRoles('user'), addComment);

module.exports = router;
