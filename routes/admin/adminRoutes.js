const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/adminController");

router.get("/summary", adminController.getSummary);
router.get("/recent-activity", adminController.getRecentActivity);

module.exports = router;
