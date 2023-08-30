const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  findAuthorizedAdmin,
  confirmResetToken,
  findAdminById,
  findAllAdmins,
  updateAdminInfo,
  deleteAdminById,
} = require("../controllers/AdminControllers");

// ADMIN ROUTES
router.post("/", registerAdmin);
router.get("/", findAuthorizedAdmin);
router.get("/all-admins", findAllAdmins);
router.get("/:adminID", findAdminById);
router.put("/:adminID", updateAdminInfo);
router.post("/:adminID", confirmResetToken);
router.delete("/:adminID", deleteAdminById);

module.exports = router;
