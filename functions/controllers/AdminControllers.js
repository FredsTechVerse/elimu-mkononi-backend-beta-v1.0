const Admin = require("../models/AdminModel");
const { handleError } = require("./ErrorHandling");

const registerAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    constcredentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    };
    const newAdmin = await Admin.create(credentials);
    newAdmin.save();
    res.sendStatus(201);
  } catch (err) {
    handleError(err, res);
  }
};

const updateAdminInfo = async (req, res) => {
  try {
    const { adminID } = req.params;
    constcredentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
    };
    await Admin.findByIdAndUpdate(adminID, credentials);
    res
      .send(202)
      .json({ message: "Admin information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};

const findAdminById = async (req, res) => {
  try {
    const { adminID } = req.params;
    constadminData = await Admin.findById(adminID);
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};

const findAllAdmins = async (req, res) => {
  try {
    const adminData = await Admin.find({});
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    const { adminID } = req.params;
    await Admin.findByIdAndDelete(adminID);
    res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  registerAdmin,
  findAdminById,
  findAllAdmins,
  updateAdminInfo,
  deleteAdminById,
};
