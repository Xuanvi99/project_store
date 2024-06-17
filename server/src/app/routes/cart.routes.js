const express = require("express");
const { cartCtrl } = require("../controller");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes
  .route("/api/cart/:userId")
  .get(cartCtrl.getCart)
  .post(cartCtrl.addToCart)
  .put(cartCtrl.updateCart)
  .delete(cartCtrl.deleteCartOneItem);

routes
  .route("/api/cart/repurchase/:userId")
  .post(cartCtrl.repurchaseProductToCart);

routes.route("/api/cart/deleteAll/:userId").delete(cartCtrl.deleteCartAllItem);
routes
  .route("/api/cart/deleteMultiple/:userId")
  .delete(cartCtrl.deleteCartMultipleItem);

module.exports = routes;
