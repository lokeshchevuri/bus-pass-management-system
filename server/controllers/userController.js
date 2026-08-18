const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Get all users (Admin only)
// @route   GET /api/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Create New Student Account
// @route   POST /api/users
const createStudentByAdmin = async (req, res, next) => {
  try {
    const { name, email, password, studentId, department, phone, route, busNo } = req.body;

    if (!name || !email || !password || !studentId) {
      return res.status(400).json({ message: "Name, email, password, and Student ID are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      studentId,
      department: department || "General",
      phone: phone || "",
      route: route || "Route 101",
      busNo: busNo || "BUS-101",
      role: "student"
    });

    res.status(201).json({
      message: "Student account created successfully",
      user: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        studentId: newStudent.studentId,
        department: newStudent.department,
        route: newStudent.route,
        busNo: newStudent.busNo,
        role: newStudent.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Update Student Route & Bus Number
// @route   PUT /api/users/:id/route-bus
const updateStudentRouteBusNo = async (req, res, next) => {
  try {
    const { route, busNo } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Student account not found." });
    }

    if (route) user.route = route;
    if (busNo) user.busNo = busNo;

    await user.save();

    res.json({
      message: "Student route and bus number updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        route: user.route,
        busNo: user.busNo
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.department = req.body.department || user.department;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      studentId: updatedUser.studentId,
      department: updatedUser.department,
      phone: updatedUser.phone,
      route: updatedUser.route,
      busNo: updatedUser.busNo,
      role: updatedUser.role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin account." });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createStudentByAdmin,
  updateStudentRouteBusNo,
  updateProfile,
  deleteUser
};
