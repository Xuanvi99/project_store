const express = require("express");
const { codeOTPMdw } = require("../middleware");
const { codeOTPCtl } = require("../controller");

const routes = express.Router();

routes
  .route("/api/otp/sendCodeEmail")
  .post(codeOTPMdw.create, codeOTPMdw.encode, codeOTPCtl.sendCodeEmail);
routes
  .route("/api/otp/sendOTPEmail")
  .post(codeOTPMdw.create, codeOTPCtl.sendOTPEmail);

routes
  .route("/api/otp/verifyEmail")
  .post(codeOTPMdw.verify, codeOTPCtl.notifyEmail);

module.exports = routes;
