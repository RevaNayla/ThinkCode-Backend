const router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const isAdmin = require("../../middleware/isAdmin");
const ctrl = require("../../controllers/admin/achievementAdminController");

router.get("/", verifyToken, isAdmin, ctrl.list);
router.post("/", verifyToken, isAdmin, ctrl.create);
router.put("/:id", verifyToken, isAdmin, ctrl.update);
router.delete("/:id", verifyToken, isAdmin, ctrl.remove);

module.exports = router;
