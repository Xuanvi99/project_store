const { productModel, imageModel, commentModel } = require("../model");

class Comment {
  getAllComment = async (req, res) => {
    const productId = req.params.productId;
    try {
      const listComment = await commentModel
        .find({ productId })
        .populate([
          { path: "userId" },
          { path: "productId" },
          { path: "images" },
        ])
        .lean();
      const totalComment = await commentModel.countDocuments();
      res.status(200).json({ listComment, totalComment });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
  getOneComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
      const comment = await commentModel
        .findById(commentId)
        .populate([
          { path: "userId" },
          { path: "productId" },
          { path: "images" },
        ])
        .lean();
      res.status(200).json({ comment });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  addComment = async (req, res) => {
    let { body, files } = req;
    try {
      const product = await productModel.findById(body.productId).lean();
      if (!body.productId || product) {
        return res.status(400).json({ errMessage: "ProductId invalid" });
      }
      if (files.length > 0) {
        const images = await imageModel.uploadMultipleFile(files, "comment");
        body = { ...body, images };
      }
      const _comment = new commentModel({ ...body });
      const result = await _comment.save();
      product.comments.push(result._id);
      await product.save();
      res.status(201).json({ message: "create comment success", result });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  updateComment = async (req, res) => {
    const commentId = req.params.commentId;
    let { body, files } = req;
    try {
      const comment = await commentModel.findById(commentId).lean();
      if (!comment) {
        return res
          .status(404)
          .json({ errorMessage: "CommentId not exit in comment" });
      }
      if (files.length > 0) {
        const { images } = comment;
        for (let i = 0; images.length > 0; i++) {
          await imageModel.removeFile(images[i]);
        }
        const imagesUpload = await imageModel.uploadMultipleFile(
          files,
          "comment"
        );
        body = { ...body, images: imagesUpload };
      }
      const result = await commentModel
        .findByIdAndUpdate(commentId, { ...body }, { new: true })
        .exec();
      res.status(200).json({ message: "update comment success", result });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
      const comment = await commentModel.findByIdAndDelete(commentId).lean();
      if (!comment) {
        return res
          .status(404)
          .json({ errorMessage: "CommentId not exit in comment" });
      }
      const product = await productModel.findById(comment.productId).lean();
      const { images } = comment;
      if (images.length > 0) {
        for (let i = 0; images.length > 0; i++) {
          await imageModel.removeFile(images[i]);
        }
      }
      const index = product.comments.findIndex((cmtId) => cmtId === commentId);
      product.comments.splice(index, 1);
      await product.save();
      res.status(200).json({ message: "Delete comment success" });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };
}

module.exports = new Comment();
