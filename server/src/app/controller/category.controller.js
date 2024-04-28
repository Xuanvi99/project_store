const { categoryModel, imageModel, productModel } = require("../model");

class Category {
  create = async (req, res) => {
    const { file, body } = req;
    try {
      const categoryFound = await categoryModel.findOne({ name: body.name });

      if (categoryFound) {
        res.status(400).json({ errMessage: "Category already exist" });
      }
      const image = await imageModel.uploadSingleFile(file, "category");

      const listProduct = await productModel.find({ brand: body.name }).exec();

      const productIds =
        listProduct.length > 0
          ? listProduct.map((productItem) => productItem._id)
          : [];

      const str = body.name.toLowerCase();
      const name = str.charAt(0).toUpperCase() + str.slice(1);

      const category = await categoryModel.create({
        name: name,
        image,
        productIds,
      });

      if (category && productIds.length > 0) {
        for (let i = 0; i < productIds.length; i++) {
          await productModel.findByIdAndUpdate(productIds[i], {
            categoryId: category._id,
          });
        }
      }
      res.status(201).json({
        message: "category create success",
        category,
      });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getAll = async (req, res) => {
    const search = req.query.search || "";
    try {
      const categories = await categoryModel
        .find({ name: { $regex: search, $options: "i" } })
        .populate([{ path: "image", select: "_id url folder" }])
        .lean();
      res.status(200).json({
        data: categories,
      });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getSingle = async (req, res) => {
    const id = req.params.id;
    try {
      if (!id)
        return res.status(400).json({ errMessage: "Invalid category Id" });

      const category = await categoryModel
        .findById(id)
        .populate("productIds")
        .lean();

      if (!category)
        return res.status(404).json({ errMessage: "Category not found" });

      res.status(200).json({
        message: "category fetched by id success",
        category,
      });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  update = async (req, res) => {
    const id = req.params.id;
    const { file, body } = req;
    console.log("file: ", file);
    let categoryUpdate = {};
    try {
      if (!id) return res.status(400).json({ errMessage: "Invalid Id" });

      const category = await categoryModel.findById(id);

      if (!category)
        return res.status(404).json({ errMessage: "Category not found" });

      if (file && category.image) {
        await imageModel.removeFile(category.image);
        const image = await imageModel.uploadSingleFile(file, "category");
        categoryUpdate = { ...body, image };
      }

      if (body.name) {
        //remove categoryId in product
        const productIds = category.productIds;
        if (productIds.length > 0) {
          for (let i = 0; i < productIds.length; i++) {
            await productModel.findByIdAndUpdate(productIds[i], {
              $unset: { categoryId: 1 },
            });
          }
        }

        const listProduct = await productModel
          .find({ brand: body.name })
          .exec();

        const newProductIds =
          listProduct.length > 0
            ? listProduct.map((productItem) => productItem._id)
            : [];

        if (newProductIds.length > 0) {
          for (let i = 0; i < newProductIds.length; i++) {
            await productModel.findByIdAndUpdate(newProductIds[i], {
              categoryId: category._id,
            });
          }
        }

        categoryUpdate = { ...categoryUpdate, productIds: newProductIds };
        console.log("categoryUpdate: ", categoryUpdate);
      }

      const result = await category.updateOne(categoryUpdate);
      if (!result)
        return res.status(400).json({ errMessage: "Update category fail" });
      res.status(200).json({
        message: "category category successfully",
      });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  delete = async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ errMessage: "Invalid Id" });
    try {
      const category = await categoryModel.findByIdAndDelete(id).lean();

      if (!category)
        return res.status(404).json({ errMessage: "Category not found" });

      const { image } = category;
      if (image) {
        await imageModel.removeFile(image);
      }
      const productIds = category.productIds;
      if (productIds.length > 0) {
        for (let i = 0; i < productIds.length; i++) {
          await productModel.findByIdAndUpdate(productIds[i], {
            $unset: { categoryId: 1 },
          });
        }
      }
      res.status(200).json({ message: "Delete category success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Category();
