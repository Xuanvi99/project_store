const express = require("express");
const { userCtl } = require("../controller");
const { userMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/user/checkUser").post(userCtl.checkUser);
routes.route("/api/user/getListUser").get(userCtl.getListUser);
routes
  .route("/api/user/:userID")
  .get(userMdw.verifyToken, userCtl.getProfile)
  .put(userMdw.verifyToken, userCtl.putUser)
  .delete(userMdw.verifyToken, userMdw.verifyRole, userCtl.deleteUser);
routes
  .route("/api/user/")
  .post(userMdw.verifyToken, userMdw.verifyRole, userCtl.postUser);
routes
  .route("/api/user/admin/:userID")
  .put(userMdw.verifyToken, userMdw.verifyRole, userCtl.isAdmin);
module.exports = routes;
