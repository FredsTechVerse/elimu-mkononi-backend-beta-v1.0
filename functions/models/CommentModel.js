const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    videoID: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Creating a model.
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
