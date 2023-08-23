const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  findAuthorizedAdmin,
  findAdminById,
  findAllAdmins,
  updateAdminInfo,
  deleteAdminById,
} = require("../controllers/AdminControllers");

// ADMIN ROUTES
router.post("/admin", registerAdmin);
router.get("/admin", findAuthorizedAdmin);
router.get("/all-admins", findAllAdmins);
router.get("/admin/:adminID", findAdminById);
router.put("/admin/:adminID", updateAdminInfo);
router.delete("/admin/:adminID", deleteAdminById);

module.exports = router;
