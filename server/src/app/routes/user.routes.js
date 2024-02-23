const express = require("express");
const { userCtl } = require("../controller");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/user/checkUser").post(userCtl.checkUser);
routes.route("/api/user/getListUser").get(userCtl.getListUser);
routes
  .route("/api/user/:userId")
  .get(verifyMdw.verifyToken, userCtl.getProfile)
  .put(verifyMdw.verifyToken, userCtl.updateUser)
  .delete(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtl.deleteUser);
routes
  .route("/api/user/")
  .post(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtl.addUser);
routes
  .route("/api/user/admin/:userId")
  .put(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtl.isAdmin);
module.exports = routes;
