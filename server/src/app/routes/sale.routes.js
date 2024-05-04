const express = require("express");
const { saleCtrl } = require("../controller");
const { verifyMdw } = require("../middleware");
const routes = express.Router();

routes.route("/api/sale/listSale").get(saleCtrl.getListSaleProduct);

routes.route("/api/sale/").post(saleCtrl.addSaleProduct);

routes
  .route("/api/sale/:saleId")
  .get(verifyMdw.verifyToken, saleCtrl.getSaleProduct)
  .put(verifyMdw.verifyToken, verifyMdw.verifyRole, saleCtrl.updateSaleProduct)
  .delete(saleCtrl.deleteSaleProduct);

module.exports = routes;
