const {
  productModel,
  imageModel,
  commentModel,
  categoryModel,
  productItemModel,
  inventoryModel,
} = require("../model");

class Product {
  getListProduct = async (req, res) => {
    const activePage = +req.query.activePage;
    const search = req.query.search || "";
    const limit = +req.query.limit;
    const productId = req.query.productId || null;
    const { sortBy, order, min_price, max_price } = req.query;
    const skip = (activePage - 1) * limit;
    console.log(order);
    try {
      const customSort = () => {
        switch (sortBy) {
          case "news":
            return { createdAt: -1 };

          case "sales":
            return { sold: -1 };

          case "price":
            return { price: order ? order : "asc" };

          case "relevancy":
            return {};

          default:
            return { $natural: -1 };
        }
      };

      const customPrice = () => {
        if (
          min_price &&
          Number(max_price) > 0 &&
          Number(max_price) >= Number(min_price)
        ) {
          return {
            $and: [
              { price: { $gte: min_price } },
              { price: { $lte: max_price } },
            ],
          };
        } else {
          return {};
        }
      };

      const listProduct = await productModel
        .find({
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
                { is_sale: { $regex: search, $options: "i" } },
              ],
            },
            { _id: { $ne: productId } },
            customPrice(),
          ],
        })
        .populate([
          { path: "thumbnail", select: "url" },
          { path: "imageIds", select: "url" },
          { path: "commentIds" },
          { path: "inventoryId", select: "_id sold total stocked" },
          { path: "flashSaleId" },
        ])
        .sort(customSort())
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      let countProduct = 0;
      if (search) {
        const findProduct = await productModel.find({
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
                { is_sale: { $regex: search, $options: "i" } },
              ],
            },
            { _id: { $ne: productId } },
          ],
        });
        countProduct = findProduct.length;
        totalPage = Math.ceil(findProduct.length / limit);
      } else {
        countProduct = await productModel.countDocuments();
        totalPage = Math.ceil(countProduct / limit);
      }

      res
        .status(200)
        .json({ data: listProduct, totalPage, result: countProduct });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getListProductSale = async (req, res) => {
    const activePage = +req.query.activePage;
    const is_sale = req.query.is_sale;
    const limit = req.query.limit;
    const skip = (activePage - 1) * limit;

    try {
      const listProduct = await productModel
        .find({ is_sale })
        .populate([
          { path: "thumbnail", select: "url" },
          { path: "imageIds", select: "url" },
          { path: "commentIds" },
          { path: "inventoryId", select: "_id sold total stocked" },
          { path: "flashSaleId" },
        ])
        .sort({ $natural: -1 })
        .skip(skip)
        .limit(limit);

      const countProduct = await productModel.find({ is_sale });
      const totalPage = Math.ceil(countProduct.length / limit);

      res.status(200).json({ data: listProduct, totalPage });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getOneProduct = async (req, res) => {
    try {
      const slugOrId = req.params.slugOrId;
      if (!slugOrId)
        return res.status(403).json({ errorMessage: "Invalid slug or íd" });
      const product = await productModel
        .findOne({ $or: [{ _id: slugOrId }, { slug: slugOrId }] })
        .populate([
          { path: "thumbnail", select: "url" },
          { path: "imageIds", select: "url" },
          { path: "commentIds" },
          { path: "inventoryId", select: "_id sold total stocked" },
          { path: "saleId" },
        ])
        .lean();
      if (!product) {
        return res
          .status(404)
          .json({ message: "ProductId not exit in product" });
      }
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  addProduct = async (req, res) => {
    const { files, body } = req;
    const { specs, ...common } = body;
    try {
      const thumbnail = await imageModel.uploadSingleFile(
        files.thumbnail[0],
        "product"
      );
      const imageIds = await imageModel.uploadMultipleFile(
        files.images,
        "product"
      );
      const _product = new productModel({
        ...common,
        thumbnail,
        imageIds,
      });
      const resultPd = await _product.save();

      if (!resultPd)
        return res.status(400).json({ errMessage: "lỗi tạo sản phẩm" });

      const category = await categoryModel
        .findOne({ name: resultPd.brand })
        .exec();

      if (category) {
        resultPd.categoryId = category._id;
        await resultPd.save();
        category.productIds.push(resultPd._id);
        await category.save();
      }

      const arrSpecs = JSON.parse(specs);
      let total = 0;
      for (const spec of arrSpecs) {
        const _productItem = new productItemModel({
          productId: resultPd._id,
          ...spec,
        });
        await _productItem.save();

        total += spec.quantity;
      }

      const _inventory = await inventoryModel.create({
        productId: resultPd._id,
        total: total,
      });

      if (_inventory) {
        resultPd.inventoryId = _inventory._id;
        await resultPd.save();
      } else {
        return res.status(400).json({ errMessage: "lỗi tạo kho hàng" });
      }

      res.status(200).json({ message: "add product success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  updateProduct = async (req, res) => {
    const productId = req.params.productId;
    const { body, files } = req;
    const { specs, ...productUpdate } = body;
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      const product = await productModel.findById(productId).lean();
      if (!product) {
        return res.status(404).json({ errMessage: "Không tìm thấy sản phẩm" });
      }
      const { imageIds, thumbnail } = product;
      if (files.images && imageIds.length > 0) {
        for (let i = 0; i < imageIds.length; i++) {
          await imageModel.removeFile(imageIds[i]);
        }
        const imagesUpLoad = await imageModel.uploadMultipleFile(
          files.images,
          "product"
        );
        productUpdate = { ...productUpdate, imageIds: imagesUpLoad };
      }
      if (files.thumbnail && thumbnail) {
        await imageModel.removeFile(thumbnail);
        const thumbnailUpLoad = await imageModel.uploadSingleFile(
          files.thumbnail,
          "product"
        );
        productUpdate = { ...productUpdate, thumbnail: thumbnailUpLoad };
      }
      if (specs) {
        let total = 0;
        const specs = JSON.parse(specs);
        for (let i = 0; i < specs.length; i++) {
          const result = await productItemModel
            .findOne({ size: specs.size })
            .exec();
          if (result) {
            result.updateOne({
              $addToSet: { quantity: specs[i].quantity },
            });
          } else {
            productItemModel.insertOne({
              productId: product._id,
              ...specs[i],
            });
          }
          total += specs[i].quantity;
        }
        await inventoryModel.updateOne(
          { _id: product._id },
          { $set: { total: total, stocked: total > 0 ? true : false } }
        );
      }
      const result = await productModel
        .findByIdAndUpdate(productId, { ...productUpdate }, { new: true })
        .exec();
      if (!result)
        return res.status(400).json({ errMessage: "Cập nhật thất bại" });
      res.status(200).json({ message: "Cập nhật thành công", result });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteProduct = async (req, res) => {
    const productId = req.params.productId;
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ errMessage: "Không tìm thấy sản phẩm" });
      }
      await productModel
        .delete({ _id: productId })
        .exec()
        .then(() => {
          return res.status(200).json({ message: "Xóa sản phẩm thành công" });
        })
        .catch(() => {
          return res.status(400).json({ message: "Xóa sản phẩm thất bại" });
        });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  restoreProduct = async (req, res) => {
    const productId = req.params.productId;
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      const product = await productModel.findOneDeleted({ _id: productId });
      if (!product) {
        return res.status(404).json({ errMessage: "Không tìm thấy sản phẩm" });
      }
      await productModel
        .restore({ _id: productId })
        .exec()
        .then(() => {
          return res
            .status(200)
            .json({ message: "khôi phục sản phẩm thành công" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ message: "khôi phục sản phẩm thất bại" });
        });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  checkNameProduct = async (req, res) => {
    const name = req.body.name;
    try {
      const result = await productModel.findOne({ name }).lean();
      if (result)
        return res
          .status(400)
          .json({ errorMessage: "Tên sản phẩm đã được sử dụng" });
      res.status(200).json({ message: "Tên sản phẩm hợp lệ" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  updateAbc = async (req, res) => {
    try {
      await productModel
        .updateMany({}, { is_sale: "normal" })
        .catch((error) => console.log(error));
      res.status(200).json({ message: "update success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Product();
