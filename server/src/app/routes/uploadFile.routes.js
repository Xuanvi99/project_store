const express = require("express");
const routes = express.Router();
const { uploadFileMdw } = require("../middleware");
const { fileCtl } = require("../controller");

routes.route("/api/upload").post(uploadFileMdw.array("file", 10), fileCtl);
module.exports = routes;
