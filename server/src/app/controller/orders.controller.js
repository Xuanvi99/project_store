const {
  orderModel,
  userModel,
  productItemModel,
  inventoryModel,
} = require("../model");
const mongoose = require("mongoose");
const connection = mongoose.connection;

class Order {
  getAllOrder = async (req, res) => {
    try {
      const activePage = +req.query.activePage || 1;
      const search = req.query.search || "";
      const limit = req.query.limit || 10;
      const status = req.query.status || "";
      const skip = (activePage - 1) * limit;
      const listOrder = await orderModel
        .find({
          $and: [
            {
              $or: [
                { codeOrder: { $regex: search, $options: "i" } },
                {
                  nameProducts: {
                    $elemMatch: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                },
              ],
            },
            { status: { $regex: status, $options: "i" } },
          ],
        })
        .populate([
          {
            path: "listProducts",
            populate: {
              path: "productId",
              model: "products",
              populate: {
                path: "thumbnail",
                model: "images",
                select: "url",
              },
            },
          },
          { path: "canceller", model: "users", select: "_id role" },
        ])
        .sort({ $natural: -1 })
        .skip(skip)
        .limit(limit);

      console.log(listOrder);

      let totalPage = 0;
      let amountOrder = 0;
      if (search) {
        amountOrder = await orderModel.find({
          $and: [
            {
              $or: [
                { codeOrder: { $regex: search, $options: "i" } },
                {
                  nameProducts: {
                    $elemMatch: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                },
              ],
            },
            { status: { $regex: status, $options: "i" } },
          ],
        });
        totalPage = Math.ceil(amountOrder.length / limit);
      } else {
        amountOrder = await orderModel.countDocuments();
        totalPage = Math.ceil(amountOrder / limit);
      }

      res.status(200).json({ data: listOrder, totalPage, amountOrder });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getOrderUser = async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(400).json({ errMessage: "Invalid user" });
      }
      const activePage = +req.query.activePage || 1;
      const search = req.query.search || "";
      const limit = req.query.limit || 10;
      const skip = (activePage - 1) * limit;
      const status = req.query.status || "";
      const listOrder = await orderModel
        .find({
          $and: [
            { userId },
            {
              $or: [
                { codeOrder: { $regex: search, $options: "i" } },
                {
                  nameProducts: {
                    $elemMatch: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                },
              ],
            },
            { status: { $regex: status, $options: "i" } },
          ],
        })
        .populate([
          {
            path: "listProducts",
            populate: {
              path: "productId",
              model: "products",
              populate: {
                path: "thumbnail",
                model: "images",
                select: "url",
              },
            },
          },
          { path: "canceller", model: "users", select: "_id role" },
        ])
        .sort({ $natural: -1 })
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      let amountOrder = 0;
      if (search) {
        amountOrder = await orderModel.find({
          $and: [
            { userId },
            {
              $or: [
                { codeOrder: { $regex: search, $options: "i" } },
                {
                  nameProducts: {
                    $elemMatch: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                },
              ],
            },
            { status: { $regex: status, $options: "i" } },
          ],
        });
        totalPage = Math.ceil(amountOrder.length / limit);
      } else if (!search && status) {
        const listOrderItem = await orderModel.find({
          $and: [{ userId }, { status: { $regex: status, $options: "i" } }],
        });
        amountOrder = listOrderItem.length;
        totalPage = Math.ceil(amountOrder / limit);
        console.log("totalPage: ", totalPage);
      } else {
        amountOrder = await orderModel.countDocuments();
        totalPage = Math.ceil(amountOrder / limit);
      }

      res.status(200).json({ data: listOrder, totalPage, amountOrder });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getAmountOrderUser = async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(400).json({ errMessage: "Invalid user" });
      }
      const statusOrder = req.query.statusOrder || "";
      const listOrder = await orderModel.find({
        $and: [{ userId }, { status: statusOrder }],
      });

      res.status(200).json({ amountOrder: listOrder.length });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  getDetailOrder = async (req, res) => {
    const codeOrder = req.params.codeOrder;
    if (!codeOrder)
      return res.status(403).json({ errMessage: "Code order undefine" });
    try {
      const order = await orderModel.findOne({ codeOrder }).populate([
        {
          path: "listProducts",
          populate: {
            path: "productId",
            model: "products",
            populate: {
              path: "thumbnail",
              model: "images",
              select: "url",
            },
          },
        },
        { path: "canceller", model: "users", select: "_id role" },
      ]);

      if (!order) {
        return res
          .status(404)
          .json({ errMessage: "Code order not exit in Order" });
      }
      res.status(200).json({ data: order });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  createOrder = async (req, res) => {
    const session = await connection.startSession();
    const userId = req.body.userId;
    try {
      session.startTransaction();
      const user = await userModel.findById(userId);
      if (!user) {
        session.abortTransaction();
        session.endSession();
        return res.status(404).json({ errMessage: "user not found!" });
      }

      const date = new Date();

      const newOrder = new orderModel({
        userId,
        codeOrder: date.getTime(),
        ...req.body,
      });
      const result = await newOrder.save();
      if (!result) {
        session.abortTransaction();
        session.endSession();
        return res.status(400).json({ errMessage: "Create order fail" });
      }

      for (const productOrder of req.body.listProducts) {
        await productItemModel
          .updateOne(
            {
              productId: productOrder.productId,
              size: productOrder.size,
            },
            {
              $inc: { quantity: -productOrder.quantity },
            }
          )
          .exec()
          .catch(() => {
            throw new Error("so luong giay da ban het");
          });

        const inventory = await inventoryModel.findOne({
          productId: productOrder.productId,
        });
        if (!inventory) {
          throw new Error();
        }
        const { total } = inventory;
        const totalInventory = total - productOrder.quantity;
        if (totalInventory > 0) {
          await inventory.updateOne({
            $inc: { total: -productOrder.quantity },
          });
        } else if (totalInventory === 0) {
          await inventory.updateOne({
            $inc: { total: -productOrder.quantity },
            stoked: true,
          });
        } else {
          throw new Error("Số lượng đặt không hợp lê");
        }
      }
      session.endSession();
      res.status(200).json({
        message: "Create order success",
        codeOrder: result.codeOrder,
        orderId: result._id,
      });
    } catch (error) {
      console.log("error: ", error);
      session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ errMessage: error ? error : "server error" });
    }
  };

  cancelledOrder = async (req, res) => {
    const codeOrder = req.params.codeOrder;
    if (!codeOrder)
      return res.status(403).json({ errMessage: "Code order undefine" });
    try {
      const order = await orderModel.findOne({ codeOrder });
      if (!order) {
        return res.status(404).json({ errMessage: "Order not found!" });
      }

      await order
        .updateOne({
          canceled_at: new Date(),
          status: "cancelled",
          ...req.body,
        })
        .exec()
        .catch(() => {
          throw new Error("update order fail");
        });

      const listProducts = order.listProducts;

      for (const productItem of listProducts) {
        await productItemModel
          .updateOne(
            {
              productId: productItem.productId,
              size: productItem.size,
            },
            {
              $inc: { quantity: +productItem.quantity },
            }
          )
          .exec()
          .catch(() => {
            throw new Error("error update quantity shoes fail");
          });

        const inventory = await inventoryModel.findOne({
          productId: productItem.productId,
        });

        if (!inventory) {
          throw new Error();
        }

        const { total } = inventory;
        await inventory.updateOne({
          $inc: { total: +productItem.quantity },
          stoked: total === 0 ? false : true,
        });
      }
      res.status(200).json({ message: "Cancelled order success" });
    } catch (error) {
      console.log("error: ", error);
      return res
        .status(500)
        .json({ errMessage: error ? error : "server error" });
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
