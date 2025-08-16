const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const {getAssignedTasks,updateTaskStatus,addComment} = require('../controllers/UserTaskController/userTaskController');

router.get('/my-tasks', isAuthenticated, authorizeRoles('user'), getAssignedTasks);
router.put('/my-tasks/:taskId/status', isAuthenticated, authorizeRoles('user'), updateTaskStatus);
router.post('/my-tasks/:id/comments', isAuthenticated, authorizeRoles('user'), addComment);

module.exports = router;
