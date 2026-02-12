const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

router.get("/:answerId", feedbackController.getFeedbackByAnswer);
router.post("/", feedbackController.createOrUpdateFeedback);

module.exports = router;
