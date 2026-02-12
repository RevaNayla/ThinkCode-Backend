const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController");
const verifyToken = require("../middleware/verifyToken");
const auth = require("../middleware/auth");

// ================= ROOM =================
router.get("/rooms/:materiId", verifyToken, discussionController.getRooms);
router.get("/room/:roomId", verifyToken, discussionController.getRoom);
router.post("/room/:roomId/join", verifyToken, discussionController.joinRoom);
router.post("/room/:roomId/send", verifyToken, discussionController.sendMessage);

// ================= MINI LESSON =================
router.get("/mini/:materiId", verifyToken, discussionController.getMiniLesson);

// ================= CLUE =================
router.get("/clue/:materiId", verifyToken, discussionController.getClues);
router.post("/clue/use/:roomId/:clueId", verifyToken, discussionController.useClue);
router.get("/clue/used/:roomId", verifyToken, discussionController.getUsedClues);
router.post(
  "/room/:roomId/clue/:clueId/use", auth,
  discussionController.useClue
);

module.exports = router;
