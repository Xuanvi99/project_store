const express = require("express");
const { messageCtrl } = require("../controller");

const routes = express.Router();
routes.route("/api/message/getList").get(messageCtrl.getListMessage);

module.exports = routes;
