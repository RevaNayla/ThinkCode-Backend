const express = require("express");
const { getTutorial, getAbout } = require("../controllers/staticController");
const router = express.Router();

router.get("/tutorial", getTutorial);
router.get("/about", getAbout);
router.get("/dashboard", (req, res) => {
  res.json({
    progress: 35,
    points: 120,
    stars: 8,
  });
});

module.exports = router;

