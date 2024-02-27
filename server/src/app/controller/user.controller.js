const { userModel, cartModel } = require("../model");

class userController {
  checkUser = async function (req, res) {
    try {
      const { phoneOrEmail } = req.body;
      const isChecked = await userModel
        .findOne({
          $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
        })
        .exec();
      res.status(200).json({ isCheckUser: isChecked ? true : false });
    } catch (error) {
      res.status(500).json({ errMessage: error });
    }
  };

  getListUser = async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const search = req.query.search || "";
      const limit = process.env.lIMIT_GET_USER;
      const skip = (page - 1) * limit;
      const listUser = await userModel
        .find({
          $or: [
            { phone: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        })
        .populate("avatar")
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      if (search) {
        const countUser = await userModel.find({
          $or: [
            { phone: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        });

        totalPage = Math.ceil(countUser.length / limit);
      } else {
        const countUser = await userModel.countDocuments();
        totalPage = Math.ceil(countUser / limit);
      }

      res.status(200).json({ listUser, totalPage });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  getProfile = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ errMessage: "Invalid user ID" });
    }
    try {
      const user = await userModel
        .findById(userId, { password: 0 })
        .populate("avatar")
        .exec();
      if (!user) res.status(400).json({ errMessage: "Invalid user ID" });
      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  addUser = async (req, res) => {
    const profile = req.body;
    try {
      const newUser = await userModel({
        ...profile,
      });
      await newUser.save();
      res.status(200).json({ message: "create user success" });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  updateUser = async (req, res) => {
    const userId = req.params.userId;
    const profileUpdate = req.body;

    if (profileUpdate)
      if (!userId) {
        res.status(400).json({ errMessage: "Invalid user ID" });
      }
    try {
      const user = await userModel
        .findByIdAndUpdate(userId, { ...profileUpdate }, { new: true })
        .populate("avatar")
        .exec();
      const { password, ...others } = user._doc;
      res.status(200).json({ message: "update user success", user: others });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  deleteUser = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ errMessage: "Invalid user ID" });
    }
    try {
      await userModel.findByIdAndDelete(userId).exec();
      res.status(200).json({ message: "delete user success" });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  isAdmin = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ errMessage: "Invalid user ID" });
    }
    try {
      const user = await userModel
        .findByIdAndUpdate(userId, { role: "admin" }, { new: true })
        .exec();
      res.status(200).json({ message: "update Admin user success" });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };
}

module.exports = new userController();
