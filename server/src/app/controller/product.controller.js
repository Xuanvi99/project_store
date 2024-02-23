const { productModel } = require("../model");
class Product {
  getListProduct = async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const search = req.query.search || "";
      const limit = process.env.lIMIT_GET_USER;
      const skip = (page - 1) * limit;
      const listProduct = await productModel
        .find({
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
              ],
            },
            {
              status: "inStock",
            },
          ],
        })
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      if (search) {
        const countProduct = await productModel.find({
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
              ],
            },
            {
              status: "inStock",
            },
          ],
        });

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

  getOneProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
      if (productId)
        return res.status(403).json({ message: "productId undefined" });
      const product = await productModel
        .exists({ _id: productId })
        .select("_id")
        .lean();
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  addProduct = async (req, res) => {
    const body = req.body;
    try {
      const _product = new productModel({ ...body });
      await _product.save();
      res.status(200).json({ message: "add product success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  updateProduct = async (req, res) => {
    const productId = req.params.productId;
    if (productId)
      return res.status(403).json({ message: "productId undefined" });
    const productUpdate = req.body;
    try {
      const product = await userModel
        .findByIdAndUpdate(productId, { ...productUpdate }, { new: true })
        .exec();

      res.status(200).json({ message: "update product success", product });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteProduct = async (req, res) => {
    const productId = req.params.productId;
    if (productId)
      return res.status(403).json({ message: "productId undefined" });
    try {
      await userModel.findByIdAndDelete(productId).exec();
      res.status(200).json({ message: "Delete product success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Product();
