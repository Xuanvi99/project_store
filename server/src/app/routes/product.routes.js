const express = require("express");
const { productCtl } = require("../controller");
const { uploadFileMdw } = require("../middleware");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/product/").get(productCtl.getListProduct);
routes.route("/api/product/").post(
  uploadFileMdw.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  verifyMdw.verifyToken,
  verifyMdw.verifyRole,
  productCtl.addProduct
);

routes
  .route("/api/product/:productId")
  .get(verifyMdw.verifyToken, productCtl.getOneProduct)
  .put(
    uploadFileMdw.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtl.updateProduct
  )
  .delete(verifyMdw.verifyToken, verifyMdw.verifyRole, productCtl.deleteProduct)
  .patch(
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtl.restoreProduct
  );

routes
  .route("/api/product/checkName")
  .post(
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtl.checkNameProduct
  );

module.exports = routes;
