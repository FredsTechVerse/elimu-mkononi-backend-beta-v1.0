const Video = require("../models/VideoModel");
const Comment = require("../models/CommentModel");
const { handleError } = require("./ErrorHandling");
const { sendEmail } = require("../controllers/EmailController");

const createComment = async (req, res) => {
  console.log("Creating comment");
  try {
    const { comment, videoID } = req.body;
    console.log({ comment, videoID });
    const newComment = await Comment.create({
      comment: comment,
      videoID: videoID,
    });
    newComment.save();
    const { _id: commentID } = newComment;
    const videoData = await Video.findByIdAndUpdate(
      videoID,
      { $push: { comments: commentID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );

    if (videoData?._doc?.comments?.includes(commentID)) {
      res.status(201).json(newComment);
    } else {
      sendEmail({
        to: [process.env.TROUBLESHOOTING_EMAIL_ACCOUNT],
        subject: "COMMENT UPDATE ERROR",
        text: "Something went wrong while updating video with comment",
      });
      res.status(500).json({
        message: "Something went wrong while updating video with comment data",
      });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const findAllComments = async (req, res) => {
  try {
    const commentsData = await Comment.find();
    res.json(commentsData);
  } catch (err) {
    handleError(err, res);
  }
};

const findComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    console.log(`Fetching Comment ${commentID}`);
    const commentData = await Comment.findById(commentID);
    res.json(commentData);
  } catch (err) {
    handleError(err, res);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    res.status(200).json({ message: "Comment deleted successfully" });
    await Comment.deleteOne({ _id: commentID });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  createComment,
  findComment,
  findAllComments,
  deleteComment,
};
