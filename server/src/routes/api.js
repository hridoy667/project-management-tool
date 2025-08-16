const express = require('express')
const Usercontroller = require('../controllers/Usercontroller.js')
const taskController = require('../controllers/taskController');
const { isAuthenticated } = require('../middleware/auth'); // JWT middleware
const { authorizeRoles } = require('../middleware/roles'); // role-based middleware
let router = express.Router()

// Users fetching & Dashboard
router.get('/users', isAuthenticated, authorizeRoles('admin', 'manager'), Usercontroller.getAllUsers);
router.get('/dashboard', isAuthenticated, authorizeRoles('user', 'manager', 'admin'), taskController.getDashboardData);
// Tasks (general)
router.post('/tasks', isAuthenticated, authorizeRoles('admin', 'manager'), taskController.createTask);
router.get('/tasks', isAuthenticated, taskController.getTasks);
router.put('/tasks/:id', isAuthenticated, authorizeRoles('admin', 'manager'), taskController.updateTask);
router.get('/tasks/:id', isAuthenticated, taskController.getTaskById);



module.exports = router;
