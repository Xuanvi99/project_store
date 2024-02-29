const express = require("express");
const { commentCtl } = require("../controller");
const { uploadFileMdw } = require("../middleware");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/comment/getAll").get(commentCtl.getAllComment);
routes
  .route("/api/comment")
  .post(
    uploadFileMdw.array("images", 10),
    verifyMdw.verifyToken,
    commentCtl.addComment
  );
routes
  .route("/api/comment/:commentId")
  .get(verifyMdw.verifyToken, commentCtl.getOneComment)
  .post(
    uploadFileMdw.array("images", 10),
    verifyMdw.verifyToken,
    commentCtl.updateComment
  )
  .put(verifyMdw.verifyToken, verifyMdw.verifyRole, commentCtl.deleteComment);
module.exports = routes;
