const express = require("express");
const routes = express.Router();
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const uploadFile = require("./uploadFile.routes");
const otpRoutes = require("./otp.routes");

routes.use(uploadFile);
routes.use(authRoutes);
routes.use(userRoutes);
routes.use(otpRoutes);

module.exports = routes;
