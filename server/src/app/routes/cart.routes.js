const express = require("express");
const { cartCtl } = require("../controller");
const routes = express.Router();

routes.route("/api/cart/:userId").get(cartCtl.getCart);
routes.route("/api/cart/:userId").post(cartCtl.addCart);
routes.route("/api/cart/:userId").put(cartCtl.updateCart);
routes.route("/api/cart/:userId").delete(cartCtl.deleteCart);
module.exports = routes;
