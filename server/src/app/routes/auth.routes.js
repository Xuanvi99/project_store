const express = require("express");
const { authCtrl } = require("../controller");
const { verifyMdw, codeOTPMdw } = require("../middleware");

const routes = express.Router();

routes.route("/api/auth/register").post(authCtrl.register);
routes.route("/api/auth/login").post(authCtrl.loginAuth);
routes
  .route("/api/auth/loginGoogle")
  .post(verifyMdw.verifyLoginGoogle, authCtrl.loginOauthGoogle);
routes.route("/api/auth/refreshToken").post(authCtrl.refreshToken);
routes.route("/api/auth/logout").post(authCtrl.logOut);
routes.route("/api/auth/update_password").post(authCtrl.updatePassword);
module.exports = routes;
