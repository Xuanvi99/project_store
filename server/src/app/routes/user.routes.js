const express = require("express");
const { userCtl } = require("../controller");
const { verifyMdw } = require("../middleware");
const { uploadFileMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/user/checkUser").post(userCtl.checkUser);
routes
  .route("/api/user/getListUser")
  .get(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtl.getListUser);
routes
  .route("/api/user/:userId")
  .get(verifyMdw.verifyToken, userCtl.getProfile)
  .put(
    uploadFileMdw.single("avatar"),
    verifyMdw.verifyToken,
    userCtl.updateUser
  )
  .delete(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtl.deleteUser);
routes
  .route("/api/user/")
  .post(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtl.addUser);
routes
  .route("/api/user/admin/:userId")
  .put(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtl.isAdmin);
routes
  .route("/api/user/blocked/:userId")
  .put(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtl.blockedUser);
module.exports = routes;
