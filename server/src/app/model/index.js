const cartModel = require("./cart.model");
const userModel = require("./user.model");
const { productModel, productItemModel } = require("./products.model");
const commentModel = require("./comments.model");
const imageModel = require("./image.model");
const notifyModel = require("./notify.model");
const orderModel = require("./order.model");
const tokenModel = require("./token.model");
const codeOTPModel = require("./codeOTP.model");
const addressModel = require("./address.model");
const categoryModel = require("./category.model");
const inventoryModel = require("./inventory.model");
const flashSaleModel = require("./flashSale.model");

module.exports = {
  cartModel,
  userModel,
  commentModel,
  imageModel,
  notifyModel,
  orderModel,
  tokenModel,
  codeOTPModel,
  addressModel,
  categoryModel,
  productModel,
  productItemModel,
  inventoryModel,
  flashSaleModel,
};
