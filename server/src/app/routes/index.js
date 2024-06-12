const express = require("express");
const routes = express.Router();
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const uploadFile = require("./uploadFile.routes");
const otpRoutes = require("./otp.routes");
const productRoutes = require("./product.routes");
const commentRoutes = require("./comment.routes");
const cartRoutes = require("./cart.routes");
const addressRoutes = require("./address.routes");
const categoryRoutes = require("./category.routes");
const imageRoutes = require("./image.routes");
const vnpayRoutes = require("./vnpay.routes");
const orderRoutes = require("./order.routes");

routes.use(uploadFile);
routes.use(authRoutes);
routes.use(userRoutes);
routes.use(otpRoutes);
routes.use(productRoutes);
routes.use(commentRoutes);
routes.use(cartRoutes);
routes.use(addressRoutes);
routes.use(categoryRoutes);
routes.use(imageRoutes);
routes.use(vnpayRoutes);
routes.use(orderRoutes);

module.exports = routes;
