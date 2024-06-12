const userCtrl = require("./user.controller");
const authCtrl = require("./auth.controller");
const fileCtrl = require("./file.controller");
const codeOTPCtrl = require("./codeOTP.controller");
const productCtrl = require("./product.controller");
const commentCtrl = require("./comments.controller");
const cartCtrl = require("./carts.controller");
const addressCtrl = require("./address.controller");
const categoryCtrl = require("./categories.controller");
const imageCtrl = require("./image.controller");
const vnpayCtrl = require("./vnpay.controller");
const orderCtrl = require("./orders.controller");

module.exports = {
  userCtrl,
  authCtrl,
  fileCtrl,
  codeOTPCtrl,
  productCtrl,
  commentCtrl,
  cartCtrl,
  addressCtrl,
  categoryCtrl,
  imageCtrl,
  vnpayCtrl,
  orderCtrl,
};
