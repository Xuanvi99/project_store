const { cartModel, userModel, productModel } = require("../model");
class Cart {
  getCart = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ errMessage: "Invalid user ID" });
    }
    try {
      const cart = await cartModel
        .findOne({ userId: userId })
        .populate({
          path: "listProduct",
          populate: { path: "productId", model: "product" },
        })
        .lean();
      if (!cart) {
        return res
          .status(404)
          .json({ errMessage: "Cart not found for this user" });
      }
      const { __v, ...others } = cart;
      return res.status(200).json({ cart: others });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  addCart = async (req, res) => {
    const userId = req.params.userId;
    const { productId, size, quantity } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ errMessage: "Invalid userId or productId " });
    }
    try {
      const cart = await cartModel.findOne({ userId: userId }).lean();
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(400).json({ errMessage: "Product not found" });
      }
      if (cart) {
        const itemIndex = cart.listProduct.findIndex(
          (p) => p.productId === productId
        );
        if (itemIndex > -1) {
          const productItem = cart.listProduct[itemIndex];
          productItem.quantity += quantity;
        } else {
          cart.listProduct.push({
            productId,
            size,
            quantity,
          });
        }
        await cart.save();
      } else {
        const user = await userModel.findOne({ _id: userId }).lean();
        const totalPrice = parseInt(quantity * price);
        await cartModel.create({
          userId: user._id,
          listProduct: [{ productId, size, quantity }],
        });
      }
      return res.status(200).json({
        message: "Add to Cart successfully!",
      });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  updateCart = async (req, res) => {
    const userId = req.params.userId;
    const { productId, size } = req.body;
    const quantity = Number.parseInt(req.body.quantity);
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ errMessage: "Invalid userId or productId " });
    }
    try {
      const cart = await cartModel.findOne({ userId: userId }).lean();
      const product = await productModel.findById(productId);
      const itemIndex = cart.listProduct.findIndex(
        (p) => p.productId === productId
      );
      if (!product) {
        cart.listProduct.splice(itemIndex, 1);
        await cart.save();
        return res.status(400).json({ errMessage: "Product not found!" });
      }
      if (itemIndex > -1) {
        if (size) cart.listProduct[itemIndex].size = size;
        if (quantity) cart.listProduct[itemIndex].quantity = quantity;
        await cart.save();
        return res.status(200).json({
          message: "update to Cart successfully!",
        });
      }
      return res.status(400).json({ message: "Item does not exist in cart" });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteCart = async (req, res) => {
    const userId = req.params.userId;
    const { productId } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ errMessage: "Invalid userId or productId!" });
    }
    try {
      const cart = await cartModel.findOne({ userId: userId }).lean();
      if (!cart)
        return res
          .status(404)
          .json({ message: "Cart not found for this user" });
      const itemIndex = cart.listProduct.findIndex(
        (p) => p.productId === productId
      );
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(400).json({ errMessage: "Product not found!" });
      }
      if (itemIndex > -1) {
        cart.listProduct.splice(itemIndex, 1);
        await cart.save();
        return res.status(200).json({
          message: "delete to Cart successfully!",
        });
      }
      return res.status(400).json({ message: "Item does not exist in cart" });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Cart();
