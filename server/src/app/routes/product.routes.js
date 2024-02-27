const express = require("express");
const { productCtl } = require("../controller");
const { uploadFileMdw } = require("../middleware");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/product/getListProduct").post(productCtl.getListProduct);
routes.route("/api/product/").post(
  uploadFileMdw.fields([
    { name: "file", maxCount: 10 },
    { name: "banner", maxCount: 1 },
  ]),
  verifyMdw.verifyToken,
  verifyMdw.verifyRole,
  productCtl.addProduct
);
routes
  .route("/api/product/:productID")
  .get(verifyMdw.verifyToken, productCtl.getOneProduct)
  .put(verifyMdw.verifyToken, verifyMdw.verifyRole, productCtl.updateProduct)
  .delete(
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    productCtl.deleteProduct
  );

module.exports = routes;
