const express = require("express");
const { cartCtrl } = require("../controller");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/cart/:userId").get(verifyMdw.verifyToken, cartCtrl.getCart);
routes.route("/api/cart/:userId").post(verifyMdw.verifyToken, cartCtrl.addCart);
routes
  .route("/api/cart/:userId")
  .put(verifyMdw.verifyToken, cartCtrl.updateCart);
routes
  .route("/api/cart/:userId")
  .delete(verifyMdw.verifyToken, cartCtrl.deleteCart);
module.exports = routes;
