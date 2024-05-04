const express = require("express");
const { commentCtrl } = require("../controller");
const { uploadFileMdw } = require("../middleware");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/comment/getAll").get(commentCtrl.getAllComment);
routes
  .route("/api/comment")
  .post(
    uploadFileMdw.array("images", 10),
    verifyMdw.verifyToken,
    commentCtrl.addComment
  );
routes
  .route("/api/comment/:commentId")
  .get(verifyMdw.verifyToken, commentCtrl.getOneComment)
  .post(
    uploadFileMdw.array("images", 10),
    verifyMdw.verifyToken,
    commentCtrl.updateComment
  )
  .put(verifyMdw.verifyToken, verifyMdw.verifyRole, commentCtrl.deleteComment);
module.exports = routes;
