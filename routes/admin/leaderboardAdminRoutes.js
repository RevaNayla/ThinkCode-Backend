const express = require("express");
const router = express.Router();

const leaderboardController = require("../../controllers/admin/leaderboardAdminController");

router.get("/individual", leaderboardController.getIndividualLeaderboard);
router.get("/group", leaderboardController.getGroupLeaderboard);

module.exports = router;
