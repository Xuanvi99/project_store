const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cloudinary = require("../../utils/cloudinary");

const ImageSchema = new Schema(
  {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    folder: { type: String, required: true },
  },
  { timestamps: true }
);

ImageSchema.statics.uploadSingleFile = async function (file, folder) {
  const imageCloud = await cloudinary.createFile(file, folder);
  const newImage = new this({
    public_id: imageCloud.public_id,
    url: imageCloud.url,
    folder: folder,
  });
  const result = await newImage.save();
  return result._id;
};

ImageSchema.statics.uploadMultipleFile = async function (files, folder) {
  let arrId = [];
  for (let i = 0; i < files.length; i++) {
    const imageCloud = await cloudinary.createFile(files[i], folder);
    const newImage = new this({
      public_id: imageCloud.public_id,
      url: imageCloud.url,
      folder: folder,
    });
    const result = await newImage.save();
    arrId.push(result._id);
  }
  return arrId;
};

ImageSchema.statics.removeFile = async function (id) {
  const items = await this.findByIdAndDelete(id).select("public_id").lean();
  if (items) {
    await cloudinary.deleteFile(items.public_id);
  }
};

module.exports = mongoose.model("image", ImageSchema);
