const express = require("express");
const routes = express.Router();
const { uploadFileMdw } = require("../middleware");
const { fileCtl } = require("../controller");

routes.route("/api/uploadFile").post(uploadFileMdw.single("file", 1), fileCtl);

module.exports = routes;
