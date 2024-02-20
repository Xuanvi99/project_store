const userModel = require("../model/user.model");
const codeOTPModel = require("../model/codeOTP.model");
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
      const text = req.query.text || "";
      const limit = process.env.lIMIT_GET_USER;
      const skip = (page - 1) * limit;
      const listUser = await userModel
        .find({
          $or: [
            { phone: { $regex: text, $options: "i" } },
            { email: { $regex: text, $options: "i" } },
          ],
        })
        .skip(skip)
        .limit(limit);

      let totalPage = 0;
      if (text) {
        const countUser = await userModel.find({
          $or: [
            { phone: { $regex: text, $options: "i" } },
            { email: { $regex: text, $options: "i" } },
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
    try {
      const userID = req.params.userID;
      const user = await userModel.findById(userID, { password: 0 }).exec();
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  postUser = async (req, res) => {
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

  putUser = async (req, res) => {
    const userID = req.params.userID;
    const profileUpdate = req.body;
    try {
      const user = await userModel
        .findByIdAndUpdate(userID, { ...profileUpdate }, { new: true })
        .exec();
      const { password, ...others } = user._doc;
      res.status(200).json({ message: "update user success", user: others });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  deleteUser = async (req, res) => {
    const userID = req.params.userID;
    try {
      await userModel.findByIdAndDelete(userID).exec();
      res.status(200).json({ message: "delete user success" });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };

  isAdmin = async (req, res) => {
    const userID = req.params.userID;
    try {
      const user = await userModel
        .findByIdAndUpdate(userID, { role: "admin" })
        .exec();
      res.status(200).json({ message: "update Admin user success" });
    } catch (error) {
      res.status(500).json({ errMessage: error | "server error" });
    }
  };
}

module.exports = new userController();
