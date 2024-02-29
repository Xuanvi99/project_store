const express = require("express");
const { productCtl } = require("../controller");
const { uploadFileMdw } = require("../middleware");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/product/getListProduct").get(productCtl.getListProduct);
routes.route("/api/product/").post(
  uploadFileMdw.fields([
    { name: "banner", maxCount: 1 },
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
      { name: "banner", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtl.updateProduct
  )
  .delete(
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtl.deleteProduct
  );

module.exports = routes;
