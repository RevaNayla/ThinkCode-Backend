const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/badgeAdminController");
const resizeBadgeImage = require("../../middleware/resizeBadgeImage");

router.get("/", controller.getAll);
router.post("/", controller.upload.single("image"), resizeBadgeImage,  controller.create);
router.put("/:id", controller.upload.single("image"), resizeBadgeImage,  controller.update);
router.delete("/:id", controller.remove);


module.exports = router;

