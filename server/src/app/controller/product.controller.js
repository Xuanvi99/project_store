const { productModel, imageModel, commentModel } = require("../model");

class Product {
  getListProduct = async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const search = req.query.search || "";
      const limit = req.query.limit || 10;
      const skip = (page - 1) * limit;
      const listProduct = await productModel
        .find({
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
              ],
            },
          ],
        })
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      if (search) {
        const countProduct = await productModel.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } },
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
      if (!productId)
        return res.status(403).json({ message: "Invalid productId " });
      const product = await productModel
        .findOne({ _id: productId })
        .populate([
          { path: "banner" },
          { path: "imageID" },
          { path: "commentID" },
        ])
        .lean();
      if (!product) {
        return res
          .status(404)
          .json({ message: "ProductId not exit in product" });
      }
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  addProduct = async (req, res) => {
    const { files, body } = req;
    const checkName = await productModel.find({ name: body.name }).lean();
    if (checkName.length > 0) {
      return res.status(400).json({ message: "name product already exist" });
    }
    try {
      const sizes = body.sizes.split(",");
      const banner = await imageModel.uploadSingleFile(
        files.banner[0],
        "product"
      );
      const imageIDs = await imageModel.uploadMultipleFile(
        files.images,
        "product"
      );
      const _product = new productModel({
        ...body,
        banner,
        imageIDs,
        sizes,
      });
      const result = await _product.save();
      res.status(200).json({ message: "add product success", result });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  updateProduct = async (req, res) => {
    const productId = req.params.productId;
    const { body, files } = req;
    let productUpdate = { ...body };
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    if (body.name) {
      const checkName = await productModel.findOne({ name: body.name }).lean();
      if (checkName) {
        return res.status(400).json({ message: "name product already exist" });
      }
    }
    try {
      const product = await productModel.findById(productId).lean();
      if (!product) {
        return res
          .status(404)
          .json({ errMessage: "ProductId not exit in product" });
      }
      const { imageIDs, banner } = product;
      if (files.images && imageIDs.length > 0) {
        for (let i = 0; i < imageIDs.length; i++) {
          await imageModel.removeFile(imageIDs[i]);
        }
        const imagesUpLoad = await imageModel.uploadMultipleFile(
          files.images,
          "product"
        );
        productUpdate = { ...productUpdate, imageIDs: imagesUpLoad };
      }
      if (files.banner && banner) {
        await imageModel.removeFile(banner);
        const bannerUpLoad = await imageModel.uploadSingleFile(
          files.banner,
          "product"
        );
        productUpdate = { ...productUpdate, banner: bannerUpLoad };
      }
      const result = await productModel
        .findByIdAndUpdate(productId, { ...productUpdate }, { new: true })
        .exec();
      res.status(200).json({ message: "update product success", result });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteProduct = async (req, res) => {
    const productId = req.params.productId;
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      const product = await productModel.findByIdAndDelete(productId).lean();
      const { banner, imageIDs, commentIDs } = product;
      if (banner) {
        await imageModel.removeFile(banner);
      }
      if (imageIDs.length > 0) {
        for (let i = 0; i < imageIDs.length; i++) {
          await imageModel.removeFile(imageIDs[i]);
        }
      }
      if (commentIDs.length > 0) {
        for (let i = 0; i < commentIDs.length; i++) {
          await commentModel.findByIdAndDelete(commentIDs[i]);
        }
      }
      res.status(200).json({ message: "Delete product success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Product();
