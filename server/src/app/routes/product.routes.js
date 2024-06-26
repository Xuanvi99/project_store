const express = require("express");
const { productCtrl } = require("../controller");
const { uploadFileMdw } = require("../middleware");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/product/").get(productCtrl.getListProduct);
routes.route("/api/product/").post(
  uploadFileMdw.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  verifyMdw.verifyToken,
  verifyMdw.verifyRole,
  productCtrl.addProduct
);

routes
  .route("/api/product/checkName")
  .post(
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtrl.checkNameProduct
  );

routes.route("/api/productItem").get(productCtrl.getProductItem);

routes.route("/api/product/filter").get(productCtrl.getListProductFilter);

routes.route("/api/product/test").post(productCtrl.updateAbc);

routes.route("/api/product/:productId").get(productCtrl.getOneProduct);

routes
  .route("/api/product/:productId")
  .put(
    uploadFileMdw.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtrl.updateProduct
  )
  .delete(
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtrl.deleteProduct
  )
  .patch(
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtrl.restoreProduct
  );

module.exports = routes;
