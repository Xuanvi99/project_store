const express = require("express");
const { orderCtrl } = require("../controller");

const routes = express.Router();

routes
  .route("/api/orders/getListOrderFilter")
  .get(orderCtrl.getListOrderFilter);
routes.route("/api/orders/getOrderUser/:userId").get(orderCtrl.getOrderUser);
routes
  .route("/api/orders/getAmountOrderUser/:userId")
  .get(orderCtrl.getAmountOrderUser);
routes
  .route("/api/orders/getDetailOrder/:codeOrder")
  .get(orderCtrl.getDetailOrder);
routes.route("/api/orders/statistics").get(orderCtrl.getStatisticsOrder);
routes.route("/api/orders/create").post(orderCtrl.createOrder);
routes.route("/api/orders/cancelled/:codeOrder").put(orderCtrl.cancelledOrder);

routes.route("/api/orders/update/:codeOrder").put(orderCtrl.updateOrder);

module.exports = routes;
