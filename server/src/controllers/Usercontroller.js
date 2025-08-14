const UserModel = require("../models/Usermodel.js");
const Role = require("../models/Role.js");
const bcrypt = require("bcrypt");
const { EncodeToken } = require("../utility/tokenHelper.js");

// user creation
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await UserModel.findOne({ email });
    if (userExists)
      return res.status(400).json({ success: false, message: "Email already exists" });

    // default role
    const defaultRole = await Role.findOne({ name: "user" });
    if (!defaultRole)
      return res.status(500).json({ success: false, message: "Default role not found" });

    // create user
    let newUser = await UserModel.create({
      name,
      email,
      password,
      role: defaultRole._id
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Invalid request",
      error: error.toString()
    });
  }
};



exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    // finding user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    
    // matching password
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
    if (isMatch) {
      let token = EncodeToken(user.email, user._id.toString());

      let option = {
        maxAge: process.env.cookie_expire_time,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      }
      //set cookie

      res.cookie("token", token, option)

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
          name: user.name,
          email: user.email,
        }
      })
    }

  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong"
    });
  }
}

exports.createUserWithRole = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists)
      return res.status(400).json({ success: false, message: "Email already exists" });

    // Find the role object
    const roleObj = await Role.findOne({ name: role });
    if (!roleObj)
      return res.status(400).json({ success: false, message: "Invalid role" });

    // Create the user with the specified role
    const newUser = await UserModel.create({ name, email, password, role: roleObj._id });

    res.status(201).json({
      success: true,
      message: "User created with custom role",
      userId: newUser._id,
      role: roleObj.name,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Failed to create user", error: error.toString() });
  }
};

exports.promoteUser = async (req, res) => {
  try {
    const { role } = req.body; // 'manager' or 'admin'
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const roleObj = await Role.findOne({ name: role });
    if (!roleObj) return res.status(400).json({ success: false, message: "Invalid role" });

    user.role = roleObj._id;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User promoted",
      userId: user._id,
      newRole: roleObj.name,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Failed to promote user", error: error.toString() });
  }
};

// Get list of all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
      .populate('role', 'name') // show role name
      .select('-password'); // hide password

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Failed to fetch users", error: error.toString() });
  }
};