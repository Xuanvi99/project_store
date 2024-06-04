const express = require("express");
const { vnpayCtrl } = require("../controller");

const routes = express.Router();

routes.route("/api/vnpay/createPayment").post(vnpayCtrl.createPaymentUrl);
routes.route("/api/vnpay/vnpay_ipn").get(vnpayCtrl.vnpay_ipn);

module.exports = routes;
