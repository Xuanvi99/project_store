const {
  orderModel,
  userModel,
  productItemModel,
  inventoryModel,
} = require("../model");

const session = await mongoose.startSession();

class Order {
  getListOrder = async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const search = req.query.search || "";
      const limit = req.query.limit || 10;
      const skip = (page - 1) * limit;
      const listOrder = await orderModel
        .find({ _id: { $regex: search, $options: "i" } })
        .populate({
          path: "listProduct",
          populate: { path: "productId", model: "products" },
        })
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      if (search) {
        const countProduct = await orderModel.find();
        totalPage = Math.ceil(countProduct.length / limit);
      } else {
        const countProduct = await orderModel.countDocuments();
        totalPage = Math.ceil(countProduct / limit);
      }

      res.status(200).json({ data: listOrder, totalPage });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getDetailOrder = async (req, res) => {
    const orderId = req.params.orderId;
    if (!orderId)
      return res.status(403).json({ errMessage: "Id order undefine" });
    try {
      const order = await orderModel.findById(orderId).populate({
        path: "listProduct",
        populate: { path: "productId", model: "products" },
      });

      if (!order) {
        return res.status(404).json({ errMessage: "Id not exit in Order" });
      }
      res.status(200).json({ data: order });

      return res.status(400).json({ message: "Item does not exist in cart" });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  createOrder = async (req, res) => {
    await session.startTransaction();
    const userId = req.body.userId;
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        await session.abortTransaction();
        await session.endSession();
        return res
          .status(400)
          .json({ errMessage: "Item does not exist in cart" });
      }

      const newOrder = new orderModel({ userId, ...req.body });
      const result = await newOrder.save();
      if (!result) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(400).json({ errMessage: "Create order fail" });
      }

      // for (const productOrder of listProduct) {
      //   await productItemModel
      //     .updateOne(
      //       {
      //         productId: productOrder.productId,
      //         size: productOrder.size,
      //       },
      //       {
      //         $inc: { quantity: -productOrder.quantity },
      //       }
      //     )
      //     .exec()
      //     .catch(() => {
      //       throw new Error();
      //     });

      //   await inventoryModel
      //     .updateOne(
      //       {
      //         productId: productOrder.productId,
      //       },
      //       {
      //         $inc: { total: -productOrder.quantity },
      //       }
      //     )
      //     .exec()
      //     .catch(() => {
      //       throw new Error();
      //     });
      // }
      await session.endSession();
      res.status(400).json({ message: "Create order success" });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  updateOrderByUser = async (req, res) => {
    try {
      return res.status(400).json({ message: "Item does not exist in cart" });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  updateStatusOrder = async (req, res) => {
    try {
      return res.status(400).json({ message: "Item does not exist in cart" });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  updateOrderByAdmin = async (req, res) => {
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

module.exports = new Order();
