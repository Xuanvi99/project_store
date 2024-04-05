const express = require("express");
const { addressCtl } = require("../controller");
const { verifyMdw } = require("../middleware");

const routes = express.Router();

routes
  .route("/api/address/:userId")
  .get(verifyMdw.verifyToken, addressCtl.get)
  .put(verifyMdw.verifyToken, addressCtl.update);

routes.route("/api/address").post(addressCtl.add);

module.exports = routes;
