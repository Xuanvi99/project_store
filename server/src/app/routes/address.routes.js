const express = require("express");
const { addressCtrl } = require("../controller");
const { verifyMdw } = require("../middleware");

const routes = express.Router();

routes
  .route("/api/address/:userId")
  .get(verifyMdw.verifyToken, addressCtrl.get)
  .put(verifyMdw.verifyToken, addressCtrl.update);

routes.route("/api/address").post(addressCtrl.add);

module.exports = routes;
