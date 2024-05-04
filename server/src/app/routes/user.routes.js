const express = require("express");
const { userCtrl } = require("../controller");
const { verifyMdw } = require("../middleware");
const { uploadFileMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/user/checkUser").post(userCtrl.checkUser);

routes
  .route("/api/user/getListUser")
  .get(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtrl.getListUser);

routes
  .route("/api/user/:userId")
  .get(verifyMdw.verifyToken, userCtrl.getProfile)
  .put(
    uploadFileMdw.single("avatar"),
    verifyMdw.verifyToken,
    userCtrl.updateUser
  )
  .delete(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtrl.deleteUser);

routes
  .route("/api/user/")
  .post(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtrl.addUser);

routes
  .route("/api/user/admin/:userId")
  .put(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtrl.isAdmin);

routes
  .route("/api/user/blocked/:userId")
  .put(verifyMdw.verifyToken, verifyMdw.verifyRole, userCtrl.blockedUser);

routes
  .route("/api/user/verifyPw")
  .post(verifyMdw.verifyToken, userCtrl.verifyPassword);

routes
  .route("/api/user/changePw/:id")
  .post(
    verifyMdw.verifyToken,
    verifyMdw.verifyCheckPassword,
    userCtrl.changePassword
  );

module.exports = routes;
