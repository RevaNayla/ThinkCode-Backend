const express = require("express");
const router = express.Router();

const verifyToken = require("../../middleware/verifyToken");
const isAdmin = require("../../middleware/isAdmin");

const adminUserCtrl = require("../../controllers/admin/userAdminController");  // Gunakan controller yang sama

// Route untuk students
router.get("/:id/rooms", verifyToken, isAdmin, adminUserCtrl.getStudentRooms);
router.get("/:id/history", verifyToken, isAdmin, adminUserCtrl.getStudentHistory);

module.exports = router;