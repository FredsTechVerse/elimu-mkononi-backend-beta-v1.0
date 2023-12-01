const express = require("express");
const router = express.Router();

const {
  registerViewer,
  findAuthorizedViewer,
  updateViewerPassword,
  confirmUserCredentials,
  confirmResetToken,
  findAllViewers,
  findViewerById,
  updateViewerInfo,
  deleteViewerById,
} = require("../controllers/ViewerControllers");
router.post("/", registerViewer);
router.post("/confirmation/:viewerID", confirmUserCredentials);
router.get("/", findAuthorizedViewer);
router.put("/password", updateViewerPassword);
router.get("/all-viewers", findAllViewers);
router.get("/:viewerID", findViewerById);
router.put("/:viewerID", updateViewerInfo);
router.post("/:viewerID", confirmResetToken);
router.delete("/:viewerID", deleteViewerById);

module.exports = router;
