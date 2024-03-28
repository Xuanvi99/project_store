const cloudinary = require("../../utils/cloudinary");
const uploadFile = async (req, res) => {
  console.log("req: ", req);
  const folder = req.body.folder;
  const files = req.files;
  console.log("files: ", files);
  if (!files) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const image = await cloudinary.uploadFile(files, folder);
    return res.status(201).json({ message: "upload image success", image });
  } catch (err) {
    res.status(500).json({ errMessage: "server error" });
  }
};

module.exports = uploadFile;
