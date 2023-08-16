const express = require("express");
const router = express.Router();

const {
  findAllResources,
  findResource,
  createResource,
  updateResource,
  deleteResource,
} = require("../controllers/ResourceController");

router.post("/", createResource);
router.get("/all-resources", findAllResources);
router.get("/:resourceID", findResource);
router.put("/:resourceID", updateResource);
router.delete("/:resourceID", deleteResource);

module.exports = router;
