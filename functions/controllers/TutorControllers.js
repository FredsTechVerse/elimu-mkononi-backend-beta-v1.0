const Tutor = require("../models/TutorModel");

const registerTutor = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    };
    const newTutor = await Tutor.create(credentials);
    newTutor.save();
    res.sendStatus(201);
  } catch (error) {
    handleError(error);
  }
};

const findAllTutors = async (req, res) => {
  try {
    const tutorData = await Tutor.find({});
    res.status(200).json(tutorData);
  } catch (err) {
    handleError(err, res);
  }
};

const findTutorById = async (req, res) => {
  try {
    let { tutorID } = req.params;
    let tutorData = await Tutor.findById(tutorID).populate({
      path: "units",
      populate: "unitChapters",
    });
    res.status(200).json(tutorData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateTutorInfo = async (req, res) => {
  try {
    const { tutorID } = req.params;
    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
    };
    await Tutor.findByIdAndUpdate(tutorID, credentials);
    res
      .send(202)
      .json({ message: "Tutor information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteTutorById = async (req, res) => {
  try {
    const { tutorID } = req.params;
    await Tutor.findByIdAndDelete(tutorID);
    res.status(200).json({
      message: "Tutor deleted successfully",
    });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  registerTutor,
  findAllTutors,
  findTutorById,
  updateTutorInfo,
  deleteTutorById,
};
