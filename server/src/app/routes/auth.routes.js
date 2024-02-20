const express = require("express");
const { authCtl } = require("../controller");
const { userMdw, codeOTPMdw } = require("../middleware");

const routes = express.Router();

routes.route("/api/auth/register").post(authCtl.register);
routes.route("/api/auth/login").post(authCtl.loginAuth);
routes
  .route("/api/auth/loginGoogle")
  .post(userMdw.verifyLoginGoogle, authCtl.loginOauthGoogle);
routes.route("/api/auth/refreshToken").post(authCtl.refreshToken);
routes.route("/api/auth/logout").get(authCtl.logOut);
routes.route("/api/auth/update_password").post(authCtl.updatePassword);
module.exports = routes;
