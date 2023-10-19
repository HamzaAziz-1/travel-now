const express = require("express");
const router = express.Router();
const {
  getFriends,
  messageUploadDB,
  messageGet,
  ImageMessageSend,
  messageSeen,
  deliveredMessage,
} = require("../controllers/messengerController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

router.get("/get-friends", authenticateUser, getFriends);
router.post("/send-message", authenticateUser, messageUploadDB);
router.get("/get-message/:id", authenticateUser, messageGet);
router.post("/image-message-send", authenticateUser, ImageMessageSend);

router.post("/seen-message", authenticateUser, messageSeen);
router.post("/delivered-message", authenticateUser, deliveredMessage);

module.exports = router;
