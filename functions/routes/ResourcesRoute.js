const express = require("express");
const router = express.Router();
// CONTROLLERS
const {
  findAllResources,
  findResource,
  createResource,
} = require("../controllers/ResourceController");
//  ROUTES
router.post("/new-resource", createResource);
router.get("/all-resources", findAllResources);
router.get("/:resourceId", findResource);
// MODULE EXPORTATION
module.exports = router;
