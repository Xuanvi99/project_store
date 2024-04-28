const express = require("express");
const { categoryCtl } = require("../controller");
const { verifyMdw } = require("../middleware");
const { uploadFileMdw } = require("../middleware");
const routes = express.Router();

routes
  .route("/api/category")
  .get(verifyMdw.verifyToken, verifyMdw.verifyRole, categoryCtl.getAll)
  .post(
    uploadFileMdw.single("image"),
    // verifyMdw.verifyToken,
    // verifyMdw.verifyRole,
    categoryCtl.create
  );

routes
  .route("/api/category/:id")
  .get(
    // verifyMdw.verifyToken,
    // verifyMdw.verifyRole,
    categoryCtl.getSingle
  )
  .put(
    uploadFileMdw.single("image"),
    // verifyMdw.verifyToken,
    // verifyMdw.verifyRole,
    categoryCtl.update
  )
  .delete(
    // verifyMdw.verifyToken,
    // verifyMdw.verifyRole,
    categoryCtl.delete
  );

module.exports = routes;
