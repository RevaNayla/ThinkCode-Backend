const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

router.post("/update", progressController.updateProgress);
router.get("/:userId/:materiId", progressController.getProgress);

module.exports = router;
