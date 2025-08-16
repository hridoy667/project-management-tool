const express = require('express');
const taskController = require('../controllers/taskController');
const { isAuthenticated } = require('../middleware/auth'); // JWT middleware
const { authorizeRoles } = require('../middleware/roles'); // role-based middleware
const {addComment} = require('../controllers/UserTaskController/userTaskController');
let router = express.Router()


// Manager-specific task routes
router.get('/tasks/assigned', isAuthenticated, authorizeRoles('manager'), taskController.getAssignedTasks);
router.put('/tasks/:taskId/dependencies', isAuthenticated, authorizeRoles('manager'), taskController.updateDependencies);
router.post('/tasks/:taskId/assign', isAuthenticated, authorizeRoles('manager'), taskController.assignUserToTask);
router.put('/tasks/:taskId/update',isAuthenticated,authorizeRoles('manager'),taskController.updateDependenciesAndUsers);
router.post('/tasks/:id/comments', isAuthenticated, authorizeRoles( 'manager'), addComment);

module.exports = router;
