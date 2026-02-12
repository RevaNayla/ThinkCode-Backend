const express = require("express");
const router = express.Router();
const badgeController = require("../controllers/badgeController"); 

router.get("/", badgeController.getAll);
router.post("/", badgeController.create);
router.put("/:id", badgeController.update);
router.delete("/:id", badgeController.remove);

module.exports = router;