const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken"); // optional: protect submit/progress
const gameController = require("../controllers/gameController");

const {
  getLevels,
  getLevel,
  submitLevel,
  getProgress
} = require("../controllers/gameController");

router.post("/xp", verifyToken, gameController.addXp);
router.get("/levels", gameController.getLevels);
router.get("/level/:id", gameController.getLevel);
router.post("/submit/:id", verifyToken, gameController.submitLevel);
router.get("/progress", verifyToken, gameController.getProgress);

module.exports = router;


