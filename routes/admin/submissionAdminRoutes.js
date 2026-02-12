const router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const isAdmin = require("../../middleware/isAdmin");
const ctrl = require("../../controllers/admin/submissionAdminController.js");

router.get("/", verifyToken, isAdmin, ctrl.list);
router.get("/export", verifyToken, isAdmin, ctrl.exportExcel);
router.get("/:id", verifyToken, isAdmin, ctrl.detail);
router.post("/:id/feedback", verifyToken, isAdmin, ctrl.feedback);


module.exports = router;
