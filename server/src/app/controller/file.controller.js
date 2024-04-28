const cloudinary = require("../../utils/cloudinary");

const uploadFile = async (req, res) => {
  const folder = req.body.folder;
  const files = req.files;
  if (!files) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const image = await cloudinary.uploadFile(files, folder);
    if (!image)
      return res.status(400).json({ errorMessage: "upload image fail" });
    res.status(201).json({ location: image });
  } catch (err) {
    res.status(500).json({ errMessage: "server error" });
  }
};

module.exports = uploadFile;
