const express = require("express");
const router = express.Router();

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  createComment,
  findComment,
  findAllComments,
  deleteComment,
} = require("../controllers/CommentController");

router.post("/", createComment);
router.get("/all-comments", findAllComments);
router.get("/:commentID", findComment);
router.delete("/:commentID", deleteComment);

module.exports = router;
