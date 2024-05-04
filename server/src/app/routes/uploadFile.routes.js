const express = require("express");
const routes = express.Router();
const { uploadFileMdw } = require("../middleware");
const { fileCtrl } = require("../controller");

routes.route("/api/uploadFile").post(uploadFileMdw.single("file", 1), fileCtrl);

module.exports = routes;
