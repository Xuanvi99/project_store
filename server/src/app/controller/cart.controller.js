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
          populate: {
            path: "productId",
            model: "products",
            populate: {
              path: "thumbnail",
              model: "images",
              select: "url",
            },
          },
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
    const { productId, size } = req.body;
    let quantity = Number.parseInt(req.body.quantity);
    let result;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ errMessage: "Invalid userId or productId " });
    }
    try {
      const cart = await cartModel.findOne({ userId: userId }).exec();
      const product = await productModel.findById(productId);

      if (!product) {
        return res.status(400).json({ errMessage: "Product not found" });
      }
      if (cart) {
        const itemIndex = cart.listProduct.findIndex(
          (p) => p.productId.toString() === productId && p.size === size
        );
        if (itemIndex > -1) {
          const productItem = cart.listProduct[itemIndex];
          quantity += productItem.quantity;
          cart.listProduct.splice(itemIndex, 1);
        }
        cart.listProduct.unshift({
          productId,
          size,
          quantity,
        });
        result = await cart.save();
      } else {
        const user = await userModel.findOne({ _id: userId }).lean();
        const newCart = await cartModel({
          userId: user._id,
          listProduct: [{ productId, size, quantity }],
        });
        result = await newCart.save();
      }
      if (!result) {
        return res.status(400).json({ errMessage: "add to item Cart fail" });
      }
      res.status(200).json({
        message: "Add to Cart successfully!",
        cartItem: result.listProduct[0],
      });
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  updateCart = async (req, res) => {
    const userId = req.params.userId;
    const { productId, size } = req.body;
    const quantity = Number.parseInt(req.body.quantity);
    if (!userId || !productId || !size) {
      return res.status(400).json({ errMessage: "Invalid cart request " });
    }
    try {
      const cart = await cartModel.findOne({ userId: userId }).exec();
      const product = await productModel.findById(productId);
      const itemIndex = cart.listProduct.findIndex(
        (p) => p.productId.toString() === productId && p.size === size
      );
      if (!product) {
        cart.listProduct.splice(itemIndex, 1);
        await cart.save();
        return res.status(400).json({ errMessage: "Product not found!" });
      }
      if (itemIndex === -1) {
        return res.status(400).json({ message: "Item does not exist in cart" });
      }
      if (quantity >= 1) {
        cart.listProduct[itemIndex].quantity = quantity;
      } else {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      const result = await cart.save();
      if (!result) {
        return res.status(400).json({ errMessage: "Update to item Cart fail" });
      }
      res.status(200).json({
        message: "update to Cart successfully!",
      });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteCartOneItem = async (req, res) => {
    const userId = req.params.userId;
    const { productId, size } = req.body;
    if (!userId || !productId || !size) {
      return res.status(400).json({ errMessage: "Invalid request" });
    }
    try {
      const cart = await cartModel.findOne({ userId: userId }).exec();
      if (!cart)
        return res
          .status(404)
          .json({ errorMessage: "Cart not found for this user" });
      const itemIndex = cart.listProduct.findIndex((p) => {
        return p.productId.toString() === productId && p.size === size;
      });
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(400).json({ errMessage: "Product not found!" });
      }
      if (itemIndex > -1) {
        cart.listProduct.splice(itemIndex, 1);
        await cart.save();
        return res.status(200).json({
          message: "delete to item Cart successfully!",
        });
      }
      return res
        .status(400)
        .json({ errMessage: "Item does not exist in cart" });
    } catch (error) {
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteCartMultipleItem = async (req, res) => {
    const userId = req.params.userId;
    const listIdProduct = req.body.listIdProduct;
    if (!userId) {
      return res.status(400).json({ errMessage: "Invalid request" });
    }
    try {
      const cart = await cartModel.findOne({ userId: userId }).exec();
      if (!cart)
        return res
          .status(404)
          .json({ errorMessage: "Cart not found for this user" });
      if (listIdProduct.length === 0) {
        return res.status(404).json({ errorMessage: "Invalid request cart" });
      }
      const listProductCart = cart.listProduct.filter(
        (product) => !listIdProduct.includes(product._id.toString())
      );
      console.log(listProductCart);

      await cart.updateOne({ $set: { listProduct: listProductCart } });

      res.status(200).json({
        message: "delete all item Cart successfully!",
      });
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteCartAllItem = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ errMessage: "Invalid request" });
    }
    try {
      const cart = await cartModel.findOne({ userId: userId }).exec();
      if (!cart)
        return res
          .status(404)
          .json({ errorMessage: "Cart not found for this user" });
      const result = await cart.updateOne({ $set: { listProduct: [] } });
      if (!result) {
        return res.status(400).json({ errMessage: "delete to item Cart fail" });
      }
      res.status(200).json({
        message: "delete all item Cart successfully!",
      });
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Cart();
