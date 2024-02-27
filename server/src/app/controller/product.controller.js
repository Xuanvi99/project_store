const { productModel, imageModel, commentModel } = require("../model");
const cloudinary = require("../../utils/cloudinary");
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
        return res.status(403).json({ message: "Invalid productId " });
      const product = await productModel
        .findOne({ _id: productId })
        .populate([
          { path: "banner" },
          { path: "images" },
          { path: "comments" },
        ])
        .lean();
      if (!product) {
        return res
          .status(404)
          .json({ message: "ProductId not exit in product" });
      }
      return res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  addProduct = async (req, res) => {
    const { body, files } = req;
    if (files.file) {
      const images = await cloudinary.uploadFile(files.file, "product");
    }
    // try {
    //   const _product = new productModel({ ...body });
    //   await _product.save();
    //   res.status(200).json({ message: "add product success" });
    // } catch (error) {
    //   res.status(500).json({ errMessage: "server error" });
    // }
  };

  updateProduct = async (req, res) => {
    const productId = req.params.productId;
    const productUpdate = req.body;
    if (productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      if (productId.images && productId.images.length > 0) {
        productId.images.forEach(async (id) => {
          const imageId = await imageModel
            .findByIdAndDelete({ _id: id })
            .select("imageId")
            .lean();
          console.log(imageId);
        });
      }
      if (productId.banner) {
        const imageId = await imageModel
          .findByIdAndDelete({ _id: productId.banner })
          .select("imageId")
          .lean();
        // await cloudinary.deleteFile(imageId);
      }
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
      return res.status(403).json({ message: "Invalid productId" });
    try {
      await userModel.findByIdAndDelete(productId).exec();
      res.status(200).json({ message: "Delete product success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Product();
