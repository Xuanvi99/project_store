const cloudinary = require("../../utils/cloudinary");

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const imageCloud = await cloudinary.uploadOneFile(req.file);
    // const deleteImage = await cloudinary.deleteFile(req.query.publicID);
    return res.status(201).json({
      publicID: imageCloud.public_id,
      url: imageCloud.url,
    });
  } catch (err) {
    res.status(500).json({ errMessage: error | "server error" });
  }
};

module.exports = uploadFile;
