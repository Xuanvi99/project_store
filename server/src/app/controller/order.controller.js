const { model } = require("mongoose");
const { orderModel } = require("../model");
class Order {
  getListOrder = async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = req.query.limit || 10;
      const skip = (page - 1) * limit;
      const listProduct = await productModel
        .find()
        .populate({
          path: "listProduct",
          populate: { path: "productId", model: "product" },
        })
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      if (search) {
        const countProduct = await productModel.find();
        totalPage = Math.ceil(countProduct.length / limit);
      } else {
        const countProduct = await productModel.countDocuments();
        totalPage = Math.ceil(countProduct / limit);
      }

      res.status(200).json({ listProduct, totalPage });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getDetailOrder = async (req, res) => {
    try {
      return res.status(400).json({ message: "Item does not exist in cart" });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  checkOrder = async (req, res) => {
    try {
      return res.status(400).json({ message: "Item does not exist in cart" });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  cancelOrder = async (req, res) => {
    try {
      return res.status(400).json({ message: "Item does not exist in cart" });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };
}

model.exports = new Order();
