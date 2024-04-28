const express = require("express");
const { imageCtl } = require("../controller");
const { verifyMdw } = require("../middleware");
const { uploadFileMdw } = require("../middleware");

const routes = express.Router();

routes.route("/api/image/createSingle").post(
  uploadFileMdw.single("image", 1),
  // verifyMdw.verifyToken,
  imageCtl.createSingle
);
routes
  .route("/api/image/createMultiple")
  .post(
    uploadFileMdw.array("image", 10),
    verifyMdw.verifyToken,
    imageCtl.createMultiple
  );

routes
  .route("/api/image/remove")
  .delete(verifyMdw.verifyToken, imageCtl.remove);

routes.route("/api/image/removeWithUrl").delete(imageCtl.removeWithUrl);

module.exports = routes;
