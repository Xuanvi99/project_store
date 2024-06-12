const express = require("express");
const { orderCtrl } = require("../controller");

const routes = express.Router();

routes.route("/api/order/getAllOrder").get(orderCtrl.getAllOrder);
routes.route("/api/order/getOrderUser/:userId").get(orderCtrl.getOrderUser);
routes
  .route("/api/order/getAmountOrderUser/:userId")
  .get(orderCtrl.getAmountOrderUser);
routes.route("/api/order/create").post(orderCtrl.createOrder);

module.exports = routes;
