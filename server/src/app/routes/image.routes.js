const express = require("express");
const { imageCtrl } = require("../controller");
const { verifyMdw } = require("../middleware");
const { uploadFileMdw } = require("../middleware");

const routes = express.Router();

routes
  .route("/api/image/createSingle")
  .post(
    uploadFileMdw.single("image", 1),
    verifyMdw.verifyToken,
    imageCtrl.createSingle
  );
routes
  .route("/api/image/createMultiple")
  .post(
    uploadFileMdw.array("image", 10),
    verifyMdw.verifyToken,
    imageCtrl.createMultiple
  );

routes
  .route("/api/image/remove")
  .delete(verifyMdw.verifyToken, imageCtrl.remove);

routes.route("/api/image/removeWithUrl").delete(imageCtrl.removeWithUrl);

module.exports = routes;
