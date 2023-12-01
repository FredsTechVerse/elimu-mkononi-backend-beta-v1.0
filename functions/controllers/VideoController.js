const Video = require("../models/VideoModel");
const { handleError } = require("./ErrorHandling");
const createVideo = async (req, res) => {
  console.log("Creating video");
  try {
    const { videoTitle, publisher, producer, genre, ageRating, videoUrl } =
      req.body;

    const newVideo = await Video.create({
      videoTitle,
      publisher,
      producer,
      genre,
      ageRating,
      videoUrl,
    });
    newVideo.save();
    res.status(201).json(newVideo);
  } catch (err) {
    handleError(err, res);
  }
};

const findAllVideos = async (req, res) => {
  try {
    const videosData = await Video.find();
    console.log({ videosData });
    res.json(videosData);
  } catch (err) {
    handleError(err, res);
  }
};

const findVideo = async (req, res) => {
  try {
    const { videoID } = req.params;
    const lessonData = await Video.findById(videoID).populate("lessonNotes");
    res.json(lessonData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateVideo = async (req, res) => {
  try {
    const { videoID } = req.params;
    const { videoTitle, publisher, producer, genre, ageRating, videoUrl } =
      req.body;

    const updatedVideoData = {
      videoTitle,
      publisher,
      producer,
      genre,
      ageRating,
      videoUrl,
    };
    await Video.findByIdAndUpdate(videoID, updatedVideoData);
    res.status(202).json({ message: "Lesson updated successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { videoID } = req.params;
    res.status(200).json({ message: "Lesson deleted successfully" });
    await Video.deleteOne({ _id: videoID });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  createVideo,
  findVideo,
  findAllVideos,
  updateVideo,
  deleteVideo,
};
