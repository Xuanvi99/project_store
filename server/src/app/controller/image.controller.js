const { imageModel } = require("../model");

class Image {
  createSingle = async (req, res) => {
    const folder = req.body.folder;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const imageId = await imageModel.uploadSingleFile(file, folder);
      if (!imageId)
        return res.status(400).json({ errorMessage: "upload image fail" });
      const image = await imageModel.findById(imageId).lean();
      res.status(201).json({ location: image.url });
    } catch (err) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  createMultiple = async (req, res) => {
    const folder = req.body.folder;
    const files = req.files;
    if (!files) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const imageIds = await imageModel.uploadMultipleFile(files, folder);
      console.log(imageIds);
      if (imageIds.length === 0)
        return res.status(400).json({ errorMessage: "upload image fail" });
      let images = [];
      for (let i = 0; i < imageIds.length; i++) {
        images.push(await imageModel.findById(imageIds[i]).lean());
      }
      res.status(201).json({ data: images });
    } catch (err) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  remove = async (req, res) => {
    const imageIds = req.body;
    try {
      if (imageIds.length > 0) {
        for (let i = 0; i < imageIds.length; i++) {
          await imageModel.removeFile(imageIds[i]);
        }
      } else {
        return res.status(400).json({ errorMessage: "Image id is undefine" });
      }
      res.status(201);
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  removeWithUrl = async (req, res) => {
    const imageUrl = req.body.imageUrl;
    try {
      if (!imageUrl)
        return res.status(400).json({ errorMessage: "Image src is undefine" });
      const imageId = await imageModel.findOne({ url: imageUrl }).lean();
      if (imageId) {
        await imageModel.removeFile(imageId._id);
      } else {
        return res.status(400).json({ errorMessage: "Image not found" });
      }
      res.status(200).json({ message: "Delete image success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Image();
