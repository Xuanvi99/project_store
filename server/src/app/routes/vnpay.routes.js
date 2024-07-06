const express = require("express");
const { vnpayCtrl } = require("../controller");

const routes = express.Router();

routes.route("/api/vnpay/createPayment").post(vnpayCtrl.createPaymentUrl);
routes.route("/api/vnpay/vnpay_ipn/:codeOrder").get(vnpayCtrl.vnpay_ipn);
routes.route("/api/vnpay/vnpay_refund").post(vnpayCtrl.vnpay_refund);

module.exports = routes;
