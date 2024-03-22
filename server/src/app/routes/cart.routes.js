const express = require("express");
const { cartCtl } = require("../controller");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/cart/:userId").get(verifyMdw.verifyToken, cartCtl.getCart);
routes.route("/api/cart/:userId").post(verifyMdw.verifyToken, cartCtl.addCart);
routes
  .route("/api/cart/:userId")
  .put(verifyMdw.verifyToken, cartCtl.updateCart);
routes
  .route("/api/cart/:userId")
  .delete(verifyMdw.verifyToken, cartCtl.deleteCart);
module.exports = routes;
