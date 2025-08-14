const express = require('express')
const Usercontroller = require('../controllers/Usercontroller.js')
const taskController = require('../controllers/taskController');
const { isAuthenticated } = require('../middleware/auth'); // JWT middleware
const { authorizeRoles } = require('../middleware/roles'); // role-based middleware

let router = express.Router()

router.post("/register",Usercontroller.register)
router.post("/login",Usercontroller.login)
// User list
router.get('/users', isAuthenticated, authorizeRoles('admin', 'manager'), Usercontroller.getAllUsers);
router.get('/dashboard-stats', isAuthenticated, authorizeRoles('admin', 'manager'), taskController.getDashboardStats);
router.post("/create-user",isAuthenticated,authorizeRoles("admin"),Usercontroller.createUserWithRole); // Only admins can use this
router.put("/promote/:id",isAuthenticated,authorizeRoles("admin"),Usercontroller.promoteUser); // Only admins
router.post('/tasks', isAuthenticated, authorizeRoles('admin', 'manager'), taskController.createTask);
router.get('/tasks', isAuthenticated, taskController.getTasks);
router.put('/tasks/:id', isAuthenticated, authorizeRoles('admin', 'manager'), taskController.updateTask);
router.delete('/tasks/:id', isAuthenticated, authorizeRoles('admin'), taskController.deleteTask);


module.exports = router;