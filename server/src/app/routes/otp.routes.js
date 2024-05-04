const express = require("express");
const { codeOTPMdw } = require("../middleware");
const { codeOTPCtrl } = require("../controller");

const routes = express.Router();

routes
  .route("/api/otp/sendCodeEmail")
  .post(codeOTPMdw.create, codeOTPMdw.encode, codeOTPCtrl.sendCodeEmail);
routes
  .route("/api/otp/sendOTPEmail")
  .post(codeOTPMdw.create, codeOTPCtrl.sendOTPEmail);

routes
  .route("/api/otp/verifyEmail")
  .post(codeOTPMdw.verify, codeOTPCtrl.notifyEmail);

module.exports = routes;
