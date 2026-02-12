const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/adminProfileController");
const auth = require("../../middleware/auth");

router.use(auth);
router.get("/", controller.getProfile);
router.put("/", controller.updateProfile);
router.put("/password", controller.updatePassword);

module.exports = router;
