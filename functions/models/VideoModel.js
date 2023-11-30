const mongoose = require("mongoose");
const { Schema } = mongoose;

const VideoSchema = new Schema(
  {
    videoTitle: { type: String, required: true },
    publisher: { type: String, required: true },
    producer: { type: String, required: true },
    genre: { type: String, required: true },
    ageRating: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const VideoModel = mongoose.model("Video", VideoSchema);
module.exports = VideoModel;
