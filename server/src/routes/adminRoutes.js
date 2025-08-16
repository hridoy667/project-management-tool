const express = require('express')
const Usercontroller = require('../controllers/Usercontroller.js')
const taskController = require('../controllers/taskController');
const { isAuthenticated } = require('../middleware/auth'); // JWT middleware
const { authorizeRoles } = require('../middleware/roles'); // role-based middleware

let router = express.Router()

// router.get('/task/:id', isAuthenticated, authorizeRoles('admin'), taskController.getTaskById);
router.post("/create-user", isAuthenticated, authorizeRoles("admin"), Usercontroller.createUserWithRole); // Only admins can use this
router.delete("/users/:id", isAuthenticated, authorizeRoles("admin"), Usercontroller.deleteUser);
router.put("/promote/:id", isAuthenticated, authorizeRoles("admin"), Usercontroller.promoteUser); // Only admins
router.delete('/tasks/:id', isAuthenticated, authorizeRoles('admin'), taskController.deleteTask);


module.exports = router;
