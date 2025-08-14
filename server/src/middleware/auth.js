const jwt = require('jsonwebtoken');
const UserModel = require('../models/Usermodel');

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.jwt_key);
    const user = await UserModel.findById(decoded.id).populate('role', 'name');
    
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid token", error: error.toString() });
  }
};
