const express = require("express");
const { categoryCtrl } = require("../controller");
const { verifyMdw } = require("../middleware");
const { uploadFileMdw } = require("../middleware");
const routes = express.Router();

routes
  .route("/api/category")
  .get(categoryCtrl.getAll)
  .post(
    uploadFileMdw.single("image"),
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    categoryCtrl.create
  );

routes
  .route("/api/category/:id")
  .get(verifyMdw.verifyToken, verifyMdw.verifyRole, categoryCtrl.getSingle)
  .put(
    uploadFileMdw.single("image"),
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    categoryCtrl.update
  )
  .delete(verifyMdw.verifyToken, verifyMdw.verifyRole, categoryCtrl.delete);

module.exports = routes;
