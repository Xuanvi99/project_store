const {
  productModel,
  imageModel,
  commentModel,
  categoryModel,
  productItemModel,
  inventoryModel,
  flashSaleModel,
} = require("../model");

class Product {
  getListProduct = async (req, res) => {
    const activePage = +req.query.activePage;
    const search = req.query.search || "";
    const limit = +req.query.limit;
    const productId = req.query.productId || null;
    const skip = (activePage - 1) * limit;

    try {
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
          ],
        })
        .populate([
          { path: "thumbnail", select: "url" },
          { path: "imageIds", select: "url" },
          { path: "commentIds" },
          { path: "inventoryId", select: "_id sold total stocked" },
        ])
        .sort({ $natural: -1 })
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
      res.status(200).json({ data: listProduct, totalPage });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getListProductFilter = async (req, res) => {
    const activePage = +req.query.activePage;
    const search = req.query.search || "";
    const limit = +req.query.limit;
    const { sortBy, order } = req.query;
    const min_price = +req.query.min_price;
    const max_price = +req.query.max_price;
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

      let listFindProduct = await productModel
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
          ],
        })
        .populate([
          { path: "thumbnail", select: "url" },
          { path: "inventoryId", select: "_id sold total stocked" },
        ])
        .sort(customSort());

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
          let a_price = 0,
            b_price = 0;
          if (a.is_sale === "sale") {
            a_price = a.priceSale;
          } else {
            a_price = a.price;
          }

          if (b.is_sale === "sale") {
            b_price = b.priceSale;
          } else {
            b_price = b.price;
          }

          if (order === "asc") {
            return a_price - b_price;
          } else {
            return b_price - a_price;
          }
        });
      }

      const listResultProduct = [];
      let i = 0;
      for (const item of listProductFilter) {
        if (i >= skip && i < skip + limit) {
          listResultProduct.push(item);
        }
        i++;
      }

      const totalPage = Math.ceil(listFindProduct.length / limit);

      res.status(200).json({
        data: listResultProduct,
        totalPage,
        result_filter: listProductFilter.length,
        result_search: listFindProduct,
      });
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
        .updateMany({}, { $set: { is_sale: "normal" } })
        .catch((error) => console.log(error));
      res.status(200).json({ message: "update success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Product();
