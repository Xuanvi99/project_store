const express = require("express");
const routes = express.Router();
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const uploadFile = require("./uploadFile.routes");
const otpRoutes = require("./otp.routes");
const productRoutes = require("./product.routes");
const commentRoutes = require("./comment.routes");
const cartRoutes = require("./cart.routes");

routes.use(uploadFile);
routes.use(authRoutes);
routes.use(userRoutes);
routes.use(otpRoutes);
routes.use(productRoutes);
routes.use(commentRoutes);
routes.use(cartRoutes);
module.exports = routes;
