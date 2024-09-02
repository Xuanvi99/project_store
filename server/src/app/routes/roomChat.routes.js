const express = require("express");
const { roomChatCtrl } = require("../controller");

const routes = express.Router();
routes.route("/api/roomChat/buyer/:buyerId").get(roomChatCtrl.getRoomChatBuyer);

routes.route("/api/roomChat/admin").get(roomChatCtrl.getRoomChatAdmin);

module.exports = routes;
