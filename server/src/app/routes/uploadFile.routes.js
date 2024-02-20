const express = require("express");
const routes = express.Router();
const { uploadFileMdw } = require("../middleware");
const { uploadFileCtl } = require("../controller");

routes.route("/api/upload").post(uploadFileMdw.single("file"), uploadFileCtl);
module.exports = routes;
