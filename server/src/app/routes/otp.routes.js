const express = require("express");
const { codeOTPMdw } = require("../middleware");
const { codeOTPCtl } = require("../controller");

const routes = express.Router();

routes
  .route("/api/otp/sendEmail")
  .post(codeOTPMdw.create, codeOTPCtl.sendEmail);

routes.route("/api/otp/verifyEmail").post(codeOTPMdw.verify, (req, res) => {
  const isExpired = req.isExpired;
  res.status(200).json({ expired: isExpired });
});

module.exports = routes;
