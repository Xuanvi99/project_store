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
      if (!productId)
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
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  addProduct = async (req, res) => {
    const { body, files } = req;
    const checkName = await productModel.findOne({ name: body.name }).lean();
    if (checkName) {
      return res.status(400).json({ message: "name product already exist" });
    }
    try {
      const sizes = body.sizes.split(",");
      const banner = await cloudinary.uploadFile(files.banner, "product");
      const images = await cloudinary.uploadFile(files.images, "product");
      const _product = new productModel({ ...body, banner, images, sizes });
      await _product.save();
      res.status(200).json({ message: "add product success" });
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
      const { images, banner } = product;
      if (files.images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const items = await imageModel
            .findByIdAndDelete(images[i])
            .select("public_id")
            .lean();
          if (items) {
            await cloudinary.deleteFile(items.public_id);
          }
        }
        const imagesUpLoad = await cloudinary.uploadFile(
          files.images,
          "product"
        );
        productUpdate = { ...productUpdate, images: imagesUpLoad };
      }
      if (files.banner && banner) {
        const items = await imageModel
          .findByIdAndDelete(banner)
          .select("public_id")
          .lean();
        if (items) {
          await cloudinary.deleteFile(items.public_id);
        }
        const bannerUpLoad = await cloudinary.uploadFile(
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
      const product = await productModel
        .findByIdAndDelete(productId)
        .populate([{ path: "banner" }, { path: "images" }])
        .lean();
      const { banner, images } = product;
      if (banner) {
        const items = await imageModel.findByIdAndDelete(banner._id);
        if (items) {
          await cloudinary.deleteFile(items.public_id);
        }
      }
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const items = await imageModel
            .findByIdAndDelete(images[i]._id)
            .select("public_id")
            .lean();
          if (items) {
            await cloudinary.deleteFile(items.public_id);
          }
        }
      }
      console.log(product);
      res.status(200).json({ message: "Delete product success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Product();
