const bcrypt = require("bcrypt");

// MODELS SECTION
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorModel");
const Admin = require("../models/AdminModel");
const RefreshToken = require("../models/RefreshTokensModel");
const { handleError } = require("./ErrorHandling");
const { sendEmail } = require("../controllers/EmailController");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./Authorization");

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const aggregateUsers = async (req, res) => {
  try {
    let totalStudents = await Student.count();
    let totalTutors = await Tutor.count();
    let totalAdmins = await Admin.count();
    const usersCount = { totalStudents, totalTutors, totalAdmins };
    res.status(200).json(usersCount);
  } catch (err) {
    handleError(err, res);
  }
};

const logInUser = async (req, res) => {
  try {
    let userData = [];
    const studentData = await Student.findOne({ email: req.body.email });
    const tutorData = await Tutor.findOne({ email: req.body.email });
    const adminData = await Admin.findOne({ email: req.body.email });

    if (studentData) {
      userData.push(studentData);
    }
    if (tutorData) {
      userData.push(tutorData);
    }
    if (adminData) {
      userData.push(adminData);
    }

    if (userData.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    let matchedUser = null;

    for (const userInfo of userData) {
      const isPasswordsMatch = await bcrypt.compare(
        req.body.password,
        userInfo.password
      );

      if (isPasswordsMatch) {
        const user = {
          userID: userInfo._id,
          email: userInfo.email,
          surname: userInfo.surname,
          role: userInfo.role,
        };
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const refreshTokenData = await RefreshToken.findOneAndUpdate(
          { name: "tokens" },
          { $push: { data: refreshToken } },
          { new: true, useFindAndModify: false, runValidation: true }
        );
        if (refreshTokenData._doc.data.includes(refreshToken)) {
          matchedUser = {
            accessToken,
            refreshToken,
            roles: [user.role],
          };
          res.status(200).json(matchedUser);
        }
        break;
      }
    }
    if (!matchedUser) {
      return res.status(401).json({ message: "Invalid username/password" });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const verifyContact = async (req, res) => {
  try {
    // STEP 1 : FIND ACCOUNTS ASSOCIATED WITH CONTACT
    const { email, contact, role } = req.body;
    let userData = [];
    const studentData = await Student.findOne({ email, role, contact });
    const tutorData = await Tutor.findOne({ email, role, contact });
    const adminData = await Admin.findOne({ email, role, contact });

    if (studentData) {
      userData.push(studentData);
    }
    if (tutorData) {
      userData.push(tutorData);
    }
    if (adminData) {
      userData.push(adminData);
    }

    if (userData.length === 0) {
      return res.status(404).json({ message: "Invalid Contact" });
    }

    // STEP 2 : MATCHING USER BY THEIR RESPECTIVE ROLE
    for (const userInfo of userData) {
      if (userInfo.role === req.body.role) {
        const resetToken = generateRandomString(6);
        const userID = userInfo?._id;
        const role = userInfo?.role;
        const userInformation = { resetToken, role, userID };
        const userRole = () => {
          if (role === "EM-201") {
            return "Student";
          } else if (role === "EM-202") {
            return "Tutor";
          } else if (role === "EM-203") {
            return "Admin";
          }
        };
        const accessToken = generateAccessToken(userInformation);
        const credentials = { resetToken };
        const message = `Hello ${
          userInfo?.firstName
        } ,${resetToken} is your password reset token for your ${userRole()} on Elimu Hub.`;

        sendEmail({
          to: [userInfo.email],
          subject: "PASSWORD RESET",
          text: message,
        });

        if (role === "EM-201") {
          await Student.findByIdAndUpdate(userID, credentials, {
            new: true,
            upsert: true,
          });
        } else if (role === "EM-202") {
          await Tutor.findByIdAndUpdate(userID, credentials, {
            new: true,
            upsert: true,
          });
        } else if (role === "EM-203") {
          await Admin.findByIdAndUpdate(userID, credentials, {
            new: true,
            upsert: true,
          });
        }
        res.status(200).json({ userInformation, accessToken });
      }
    }
  } catch (err) {
    handleError(err, res);
  }
};

const logOutUser = async (req, res) => {
  try {
    if (!req.body.refreshToken) {
      return res.status(404).json({ message: "Refresh tokens not found." });
    }

    await RefreshToken.findOneAndUpdate(
      { name: "tokens" },
      { $pull: { data: req.body.refreshToken } }
    );
    res.sendStatus(200);
  } catch (err) {
    handleError(err, res);
  }
};

const findAllUsers = async (req, res) => {
  try {
    if (req?.user?.role.includes("EM-203")) {
      const studentData = await Student.find({});
      const tutorData = await Tutor.find({});
      const adminData = await Admin.find({});

      const totalUsers = {
        totalStudents: studentData?.length,
        totalTutors: tutorData?.length,
        totalAdmins: adminData?.length,
      };

      res.status(200).json(totalUsers);
    } else {
      res.status(401).json({ message: "User action not allowed" });
    }
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  logInUser,
  logOutUser,
  findAllUsers,
  aggregateUsers,
  verifyContact,
  generateRandomString,
};
