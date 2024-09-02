const { default: mongoose } = require("mongoose");
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
    const is_sale = req.query.is_sale || false;
    const status = req.query.status || "";
    const skip = (activePage - 1) * limit;

    try {
      const saleProduct = is_sale === "true" ? [true] : [true, false];
      const statusProduct = status ? [status] : ["active", "inactive"];

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
            {
              status: { $in: statusProduct },
            },
            {
              is_sale: { $in: saleProduct },
            },
            { _id: { $ne: productId } },
          ],
        })
        .populate([
          { path: "thumbnail", select: "url" },
          { path: "imageIds", select: "url" },
          { path: "inventoryId", select: "_id sold total stocked" },
        ])
        .sort({ $natural: -1 })
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      let amountProductFound = 0;
      if (search) {
        const findProduct = await productModel.find({
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
              ],
            },
            {
              status: { $in: statusProduct },
            },
            {
              is_sale: { $in: saleProduct },
            },
            { _id: { $ne: productId } },
          ],
        });
        amountProductFound = findProduct.length;
        totalPage = Math.ceil(amountProductFound / limit);
      } else {
        const findProduct = await productModel.find({
          is_sale: { $in: saleProduct },
        });
        amountProductFound = findProduct.length;
        totalPage = Math.ceil(amountProductFound / limit);
      }
      res.status(200).json({ listProduct, totalPage, amountProductFound });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getListProductFilter = async (req, res) => {
    const activePage = +req.query.activePage;
    const search = req.query.search || "";
    const limit = +req.query.limit;
    const { sortBy, order } = req.query;
    const min_price = +req.query.min_price || 0;
    const max_price = +req.query.max_price || 0;
    const skip = (activePage - 1) * limit;
    try {
      const customSort = () => {
        switch (sortBy) {
          case "news":
            return { createdAt: -1 };

          case "sales":
            return { sold: -1 };

          default:
            return {};
        }
      };

      let listFindProduct = [];
      if (search === "sale") {
        listFindProduct = await productModel
          .find({
            $and: [
              {
                is_sale: true,
              },
              {
                deleted: { $eq: false },
              },
            ],
          })
          .populate([
            { path: "thumbnail", select: "url" },
            { path: "inventoryId", select: "_id sold total stocked" },
            { path: "categoryId", select: "_id name" },
          ])
          .sort(customSort());
      } else {
        listFindProduct = await productModel
          .find({
            $and: [
              {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { brand: { $regex: search, $options: "i" } },
                  { slug: { $regex: search, $options: "i" } },
                ],
              },
              {
                deleted: { $eq: false },
              },
            ],
          })
          .populate([
            { path: "thumbnail", select: "url" },
            { path: "inventoryId", select: "_id sold total stocked" },
            { path: "categoryId", select: "_id name" },
          ])
          .sort(customSort());
      }

      let listProductFilter = [...listFindProduct];
      if (min_price >= 0 && max_price > 0 && min_price <= max_price) {
        listProductFilter = listFindProduct.filter((product) => {
          const { is_sale, price, priceSale } = product;
          let priceProduct = 0;
          if (is_sale === "sale") {
            priceProduct = priceSale;
          } else {
            priceProduct = price;
          }
          return priceProduct >= min_price && priceProduct <= max_price;
        });
      }

      if (min_price > max_price) {
        return res.status(200).json({
          data: [],
          totalPage: 0,
          result_filter: 0,
          result_search: listFindProduct,
        });
      }

      if (order) {
        listProductFilter = listProductFilter.sort((a, b) => {
          const a_price = a.is_sale ? a.priceSale : a.price;
          const b_price = b.is_sale ? b.priceSale : b.price;

          if (order === "asc") {
            return a_price - b_price;
          } else {
            return b_price - a_price;
          }
        });
      }

      const listResultProduct = [];
      for (let i = 0; i < listProductFilter.length; i++) {
        if (i >= skip && i < skip + limit) {
          listResultProduct.push(listProductFilter[i]);
        }
      }

      const totalPage = Math.ceil(listFindProduct.length / limit);

      res.status(200).json({
        listProduct: listResultProduct,
        totalPage,
        amount_filter: listProductFilter.length,
        result_search: listFindProduct,
      });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getListProductFilterDashboard = async (req, res) => {
    const activePage = +req.query.activePage;
    const search = req.query.search || "";
    const limit = +req.query.limit;
    const { sortBy, order } = req.query;
    const status = req.query.status || "";

    const skip = (activePage - 1) * limit;
    try {
      const customSort = () => {
        switch (sortBy) {
          case "news":
            return { createdAt: -1 };

          case "sales":
            return { sold: -1 };

          default:
            return {};
        }
      };

      const statusProduct = status ? [status] : ["active", "inactive"];

      let listFindProduct = await productModel
        .find({
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
              ],
            },
            {
              status: { $in: statusProduct },
            },
          ],
        })
        .populate([
          { path: "thumbnail", select: "url" },
          { path: "inventoryId", select: "_id sold total stocked" },
          { path: "categoryId", select: "_id name" },
        ])
        .sort(customSort());

      let listProductFilter = [...listFindProduct];

      if (order) {
        listProductFilter = listProductFilter.sort((a, b) => {
          const a_price = a.is_sale ? a.priceSale : a.price;
          const b_price = b.is_sale ? b.priceSale : b.price;

          if (order === "asc") {
            return a_price - b_price;
          } else {
            return b_price - a_price;
          }
        });
      }

      const listResultProduct = [];
      for (let i = 0; i < listProductFilter.length; i++) {
        if (i >= skip && i < skip + limit) {
          listResultProduct.push(listProductFilter[i]);
        }
      }

      const totalPage = Math.ceil(listFindProduct.length / limit);

      res.status(200).json({
        listProduct: listResultProduct,
        totalPage,
        amountProductFound: listProductFilter.length,
      });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getListProductDeleted = async (req, res) => {
    const activePage = +req.query.activePage | 1;
    const search = req.query.search || "";
    const limit = +req.query.limit || 10;
    const skip = (activePage - 1) * limit;
    try {
      let listFindProduct = await productModel
        .findDeleted({
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
              ],
            },
            {
              deleted: true,
            },
          ],
        })
        .populate([
          { path: "thumbnail", select: "url" },
          { path: "inventoryId", select: "_id sold total stocked" },
          { path: "categoryId", select: "_id name" },
          { path: "deletedBy", select: "_id userName role" },
        ])
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      let amountProductFound = 0;
      if (search) {
        const findProductDeleted = await productModel.findDeleted({
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
              ],
            },
            {
              deleted: true,
            },
          ],
        });
        amountProductFound = findProductDeleted.length;
        totalPage = Math.ceil(amountProductFound / limit);
      } else {
        const findProductDeleted = await productModel.findDeleted({
          deleted: { $exists: true, $in: [true] },
        });
        amountProductFound = findProductDeleted.length;
        totalPage = Math.ceil(amountProductFound / limit);
      }
      res.status(200).json({
        listProduct: listFindProduct,
        totalPage,
        amountProductFound,
      });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getDetailProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
      if (!productId)
        return res.status(403).json({ errorMessage: "Invalid slug or íd" });
      const product = await productModel
        .findById(productId)
        .populate([
          { path: "thumbnail", select: "url" },
          { path: "imageIds", select: "url" },
          { path: "commentIds" },
          { path: "categoryId" },
          { path: "inventoryId", select: "_id sold total stocked" },
        ])
        .lean();

      if (!product) {
        return res
          .status(404)
          .json({ errorMessage: "ProductId not exit in product" });
      }
      const listProductItem = await productItemModel
        .find({
          productId: product._id,
        })
        .lean();

      res.status(200).json({ product, listProductItem });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getProductItem = async (req, res) => {
    const { productId, size } = req.query;

    try {
      const productItem = await productItemModel
        .findOne({ productId, size })
        .lean()
        .catch((error) => console.log(error));
      if (!productItem) {
        return res.status(404).json({ errorMessage: "Get product item fail" });
      }
      res.status(200).json({ data: productItem });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getStatisticsProduct = async (req, res) => {
    try {
      const listStatistics = ["all", "active", "inactive", "deleted"];
      let data = {};
      for (const statistic of listStatistics) {
        const ListProduct = await productModel.findWithDeleted({
          status:
            statistic === "all"
              ? {
                  $regex: "",
                  $options: "i",
                }
              : statistic,
        });
        data[statistic] = ListProduct.length;
      }

      res.status(200).json({ ...data });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
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

  updateInfoProduct = async (req, res) => {
    const productId = req.params.productId;
    const { brand } = req.body;
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      const product = await productModel.findById(productId).lean();
      if (!product) {
        return res.status(404).json({ errMessage: "Không tìm thấy sản phẩm" });
      }

      if (brand !== product.brand) {
        const categoryOld = await categoryModel
          .findOne({ name: product.brand })
          .exec();
        const categoryNew = await categoryModel.findOne({ name: brand }).exec();
        if (categoryOld && categoryNew) {
          product.categoryId = categoryNew._id;
          await product.save();
          categoryNew.productIds.push(product._id);
          await categoryNew.save();

          const productIds = categoryOld.productIds.filter(
            (id) => id !== product._id
          );
          categoryOld.productIds = productIds;
          await categoryOld.save();
        }
      }

      const result = await productModel
        .findByIdAndUpdate(productId, { ...req.body }, { new: true })
        .exec();
      if (!result)
        return res
          .status(400)
          .json({ errMessage: "Cập nhật thông tin thất bại" });
      res
        .status(200)
        .json({ message: "Cập nhật thông tin thành công", result });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  updateThumbnailAndImagesProduct = async (req, res) => {
    const productId = req.params.productId;
    const { files, body } = req;

    let productUpdate = {};
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      const product = await productModel.findById(productId).exec();
      if (!product) {
        return res.status(404).json({ errMessage: "Không tìm thấy sản phẩm" });
      }
      if (body.listIdImageDeleted) {
        const listIdImageDeleted = JSON.parse(body.listIdImageDeleted);
        const imagesNew = product.imageIds.filter(
          (id) => !listIdImageDeleted.includes(id.toString())
        );

        await product.updateOne({ imageIds: imagesNew });

        for (const id of listIdImageDeleted) {
          await imageModel.removeFile(id);
        }
      }

      if (files.thumbnail && files.thumbnail.length > 0) {
        if (product.thumbnail) await imageModel.removeFile(product.thumbnail);
        const thumbnailUpLoad = await imageModel.uploadSingleFile(
          files.thumbnail[0],
          "product"
        );

        productUpdate = { ...productUpdate, thumbnail: thumbnailUpLoad };
      }

      if (files.images && files.images.length > 0) {
        const imagesUpLoad = await imageModel.uploadMultipleFile(
          files.images,
          "product"
        );
        productUpdate = {
          ...productUpdate,
          imageIds: [...product.imageIds, ...imagesUpLoad],
        };
      }
      const result = await productModel
        .findByIdAndUpdate(productId, { ...productUpdate }, { new: true })
        .exec();
      if (!result)
        return res
          .status(400)
          .json({ errMessage: "Cập nhật hình ảnh thất bại" });
      res.status(200).json({ message: "Cập nhật hình ảnh thành công" });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ errMessage: "server error" });
    }
  };

  updateSizeAndQuantityProduct = async (req, res) => {
    const productId = req.params.productId;
    const { specs } = req.body;
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      const product = await productModel.findById(productId).lean();
      if (!product) {
        return res.status(404).json({ errMessage: "Không tìm thấy sản phẩm" });
      }
      let total = 0;

      const listProductItem = await productItemModel
        .find({
          productId: product._id,
        })
        .lean();

      for (const productItem of listProductItem) {
        for (let i = 0; i < specs.length; i++) {
          if (Number(productItem.size) === Number(specs[i])) {
            break;
          }
          if (specs.length === i + 1) {
            await productItemModel.findByIdAndDelete(productItem._id);
          }
        }
      }

      for (let i = 0; i < specs.length; i++) {
        const result = await productItemModel
          .findOne({ size: specs.size })
          .exec();
        if (result) {
          result.updateOne({
            $addToSet: { quantity: specs[i].quantity },
          });
        } else {
          const newProductItem = await productItemModel({
            productId: product._id,
            ...specs[i],
          });
          await newProductItem.save();
        }
        total += specs[i].quantity;
      }

      await inventoryModel.updateOne(
        { _id: product._id },
        { $set: { total: total, stocked: total > 0 ? true : false } }
      );

      res.status(200).json({ message: "Cập nhật size và số lượng thành công" });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteOneProduct = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.body.userId;
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ errMessage: "Không tìm thấy sản phẩm" });
      }
      await productModel
        .updateOneDeleted(
          { _id: productId },
          {
            status: "deleted",
            deletedBy: userId,
          }
        )
        .exec()
        .then(async () => {
          await product.delete();
          return res.status(200).json({ message: "Xóa sản phẩm thành công" });
        })
        .catch(() => {
          return res.status(400).json({ message: "Xóa sản phẩm thất bại" });
        });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteMultipleProduct = async (req, res) => {
    const userId = req.body.userId;
    const listProductId = req.body.listProductId;
    try {
      for (const productId of listProductId) {
        await productModel
          .updateOneDeleted(
            { _id: productId },
            {
              status: "deleted",
              deletedBy: userId,
            }
          )
          .exec()
          .then(async () => {
            await productModel.delete({ _id: productId });
          })
          .catch(() => {
            return res.status(400).json({ message: "Lỗi xóa nhiều sản phẩm" });
          });
      }
      res.status(200).json({ message: "Xóa nhiều sản phẩm thành công" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  restoreOneProduct = async (req, res) => {
    const productId = req.params.productId;
    if (!productId)
      return res.status(403).json({ message: "Invalid productId" });
    try {
      const product = await productModel.findOneDeleted({ _id: productId });
      if (!product) {
        return res.status(404).json({ errMessage: "Không tìm thấy sản phẩm" });
      }
      await productModel
        .updateOneDeleted(
          { _id: productId },
          {
            status: "inactive",
            deleted: false,
          }
        )
        .exec()
        .then(async () => {
          await productModel.restore({ _id: productId });
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

  restoreMultipleProduct = async (req, res) => {
    const listProductId = req.body.listProductId;
    try {
      for (const productId of listProductId) {
        await productModel
          .updateOneDeleted(
            { _id: productId },
            {
              status: "inactive",
              deleted: false,
            }
          )
          .exec()
          .then(async () => {
            await productModel.restore({ _id: productId });
          })
          .catch(() => {
            return res
              .status(400)
              .json({ message: "khôi phục sản phẩm thất bại" });
          });
      }
      return res
        .status(200)
        .json({ message: "Nhiều sản phẩm khôi phục thành công" });
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
        .updateMany({}, { $unset: { summary: "" } })
        .catch((error) => console.log(error));
      res.status(200).json({ message: "update success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Product();
