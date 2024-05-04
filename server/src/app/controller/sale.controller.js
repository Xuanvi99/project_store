const { productModel, saleModel, categoryModel } = require("../model");

class Sale {
  getListSaleProduct = async (req, res) => {
    const activePage = +req.query.activePage || 1;
    const status = req.query.status || "";
    const limit = req.query.limit || 10;
    const skip = (activePage - 1) * limit;
    try {
      const listSaleProduct = await saleModel
        .find({ status: { $regex: status, $options: "i" } })
        .populate([{ path: "productId" }])
        .sort({ $natural: -1 })
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      if (status) {
        const countSale = await saleModel.find({
          status: { $regex: status, $options: "i" },
        });
        totalPage = Math.ceil(countSale.length / limit);
      } else {
        const countSale = await saleModel.countDocuments();
        totalPage = Math.ceil(countSale / limit);
      }
      res.status(200).json({ data: listSaleProduct, totalPage });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getSaleProduct = async (req, res) => {
    const saleId = req.params.saleId;
    if (!saleId)
      return res.status(403).json({ errorMessage: "Invalid id sale" });
    try {
      const saleProduct = await saleModel
        .findById(saleId)
        .populate([{ path: "productId" }])
        .lean();
      if (!saleProduct) {
        return res
          .status(404)
          .json({ errorMessage: "Id sale product not exit in sale" });
      }
      res.status(200).json({ data: saleProduct });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ errMessage: "server error" });
    }
  };

  addSaleProduct = async (req, res) => {
    const body = req.body;
    const { productId } = body;
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ errorMessage: "Không tim thấy sản phẩm" });
      }

      const checkSale = await saleModel.findOneAndDelete({ productId });
      const category = await categoryModel.findOne({ name: "Flash sale" });

      if (checkSale && category.productIds.length > 0) {
        await category.updateOne({
          $pull: { productIds: { $in: [product._id] } },
        });
      }

      const _sale = new saleModel({
        ...body,
      });

      await product.updateOne({
        saleId: _sale._id,
        is_sale: _sale.status,
      });

      await category.updateOne({
        $push: { productIds: product._id },
      });

      const resultSale = await _sale.save();

      if (!resultSale) {
        await product.updateOne({
          is_sale: "normal",
          $unset: { saleId: "" },
        });

        await category.updateOne({
          $pull: { productIds: { $in: product._id } },
        });

        return res.status(400).json({ errMessage: "Lỗi thêm sản phẩm sale" });
      }
      res.status(200).json({ message: "Thêm sản phẩm sale thành công" });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ errMessage: "server error" });
    }
  };

  updateSaleProduct = async (req, res) => {
    const saleId = req.params.saleId;
    const body = req.body;
    if (!saleId)
      return res.status(403).json({ errorMessage: "Invalid id sale" });
    try {
      const result = await saleModel.updateOne({ _id: saleId }, { ...body });

      if (!result) {
        return res
          .status(400)
          .json({ errMessage: "Lỗi cập nhật sản phẩm sale" });
      }
      res.status(200).json({ message: "Cập nhật  sale thành công" });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteSaleProduct = async (req, res) => {
    const saleId = req.params.saleId;
    try {
      const result = await saleModel.findByIdAndDelete(saleId);
      if (!result) {
        return res.status(400).json({ errMessage: "Lỗi xóa sản phẩm sale" });
      }
      await productModel.updateOne(
        { _id: result.productId },
        { is_sale: "normal", $unset: { saleId: "" } }
      );

      await categoryModel.updateOne(
        { name: "Flash sale" },
        {
          $pull: { productIds: { $in: [result.productId] } },
        }
      );

      res.status(200).json({ message: "Xóa sale thành công" });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Sale();
