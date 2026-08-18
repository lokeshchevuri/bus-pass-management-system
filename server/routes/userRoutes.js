const express = require("express");
const {
  getAllUsers,
  getUserById,
  createStudentByAdmin,
  updateStudentRouteBusNo,
  updateProfile,
  deleteUser
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.post("/", protect, adminOnly, createStudentByAdmin);
router.put("/:id/route-bus", protect, adminOnly, updateStudentRouteBusNo);
router.put("/profile", protect, updateProfile);
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
