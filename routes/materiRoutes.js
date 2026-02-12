const express = require("express");
const router = express.Router();
const materiController = require("../controllers/materiController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyTokenOptional, materiController.getAllMateri);
router.get("/:id", verifyTokenOptional, materiController.getMateriDetail);
router.post("/:id/progress", verifyToken, materiController.updateProgress);
router.post("/:id/complete-step", verifyToken, materiController.completeStep);

function verifyTokenOptional(req, res, next) {
  const auth = req.headers.authorization;
  if (auth) {
    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET || "secretjwt");
      req.user = decoded;
    } catch (e) {  }
  }
  next();
}

module.exports = router;
