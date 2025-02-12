const express = require("express");
const { chatCtrl } = require("../controller");
const { uploadFileMdw } = require("../middleware");

const routes = express.Router();
routes.route("/api/chat/getConversations/:id").get(chatCtrl.getConversations);
routes
  .route("/api/chat/getOneConversation/:id")
  .get(chatCtrl.getOneConversation);

routes.route("/api/chat/getMessages/:conversationId").get(chatCtrl.getMessages);

routes.route("/api/chat/getOneMessages/:messageId").get(chatCtrl.getOneMessage);

routes
  .route("/api/chat/seenMessages/:conversationId")
  .put(chatCtrl.seenMessages);

routes.route("/api/chat/getUsersChat").get(chatCtrl.getUsersChat);

routes
  .route("/api/chat/sendMessage/text/:conversationId")
  .post(chatCtrl.sendMessageText);

routes
  .route("/api/chat/sendMessage/images/:conversationId")
  .post(
    uploadFileMdw.array([{ name: "images", maxCount: 50 }]),
    chatCtrl.sendMessageImages
  );

routes
  .route("/api/chat/unreadMessage/:conversationId")
  .get(chatCtrl.unreadMessage);

module.exports = routes;
