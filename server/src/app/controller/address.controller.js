const { addressModel, userModel } = require("../model");

class Address {
  get = async (req, res) => {
    const userId = req.params.userId;
    try {
      const address = await addressModel.findOne({ userId }).lean();
      if (!address)
        return res.status(404).json({ errMessage: "Address not found" });
      res.status(200).json({ address });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
  add = async (req, res) => {
    const body = req.body;
    try {
      const user = await userModel.findById(body.userId).exec();
      if (!user) {
        res.status(400).json({ errMessage: "User not found!" });
      }
      const newAddress = await addressModel.saveAddress(body);
      if (!newAddress) {
        res.status(400).json({ errMessage: "Create address fail" });
      }
      res.status(201).json({ message: "Create address success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
  update = async (req, res) => {
    const userId = req.params.userId;
    const body = req.body;
    try {
      const address = await addressModel.findOne({ userId }).lean();
      if (!address)
        return res.status(404).json({ errMessage: "Address not found" });
      const result = await addressModel.findByIdAndUpdate(address._id, {
        ...body,
      });
      if (!result)
        return res.status(400).json({ errMessage: "Update user fail" });
      res.status(201).json({ message: "Update user success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
  // delete = async (req, res) => {
  //   const id = req.params.id;
  //   try {
  //     const result = await addressModel.findByIdAndDelete(id).exec();
  //     if (!result) res.status(400).json({ errMessage: "Delete address fail" });
  //     res.status(201).json({ message: "Delete user success" });
  //   } catch (error) {
  //     res.status(500).json({ errMessage: "server error" });
  //   }
  // };
}

module.exports = new Address();
