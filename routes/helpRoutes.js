const express = require("express");
const { sendHelp, getHelpMessages } = require("../controllers/helpController");
const router = express.Router();

router.post("/send", sendHelp);
router.get("/list", getHelpMessages);

module.exports = router;
