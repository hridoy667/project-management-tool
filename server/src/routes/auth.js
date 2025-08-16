const express = require('express')
const Usercontroller = require('../controllers/Usercontroller.js')
let router = express.Router()

// Auth
router.post("/register", Usercontroller.register)
router.post("/login", Usercontroller.login)
router.post("/logout", Usercontroller.logout);


module.exports = router;
