const express = require("express");
const { flashSaleCtrl } = require("../controller");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/flashSale/listSale").get(flashSaleCtrl.getListSaleProduct);

routes.route("/api/flashSale/").post(flashSaleCtrl.addSaleProduct);

routes
  .route("/api/flashSale/:saleId")
  .get(verifyMdw.verifyToken, flashSaleCtrl.getSaleProduct)
  .put(
    verifyMdw.verifyToken,
    verifyMdw.verifyRole,
    flashSaleCtrl.updateSaleProduct
  )
  .delete(flashSaleCtrl.deleteSaleProduct);

module.exports = routes;
