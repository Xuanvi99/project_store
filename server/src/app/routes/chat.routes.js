const express = require("express");
const { chatCtrl } = require("../controller");
const { uploadFileMdw } = require("../middleware");

const routes = express.Router();
routes.route("/api/chat/getConversation/:id").get(chatCtrl.getConversation);
routes
  .route("/api/chat/getOneConversation/:id")
  .get(chatCtrl.getOneConversation);

routes.route("/api/chat/getMessages/:conversationId").get(chatCtrl.getMessage);

routes.route("/api/chat/getUsers").get(chatCtrl.getUsersChat);

routes
  .route("/api/chat/sendMessage/text/:conversationId")
  .post(chatCtrl.sendMessageText);

routes
  .route("/api/chat/sendMessage/images/:conversationId")
  .post(
    uploadFileMdw.array([{ name: "images", maxCount: 10 }]),
    chatCtrl.sendMessageImages
  );

module.exports = routes;
