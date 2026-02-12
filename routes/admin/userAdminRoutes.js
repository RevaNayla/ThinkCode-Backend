const express = require("express");
const router = express.Router();

const verifyToken = require("../../middleware/verifyToken");
const isAdmin = require("../../middleware/isAdmin");

const adminUserCtrl = require("../../controllers/admin/userAdminController");

router.get("/", verifyToken, isAdmin, adminUserCtrl.list);
router.get("/:id", verifyToken, isAdmin, adminUserCtrl.detail);
router.post("/", verifyToken, isAdmin, adminUserCtrl.create);
router.put("/:id", verifyToken, isAdmin, adminUserCtrl.update);
router.delete("/:id", verifyToken, isAdmin, adminUserCtrl.remove);
router.patch("/:id/toggle", verifyToken, isAdmin, adminUserCtrl.toggleActive);
router.patch("/:id/reset-password", verifyToken, isAdmin, adminUserCtrl.resetPassword);



module.exports = router;