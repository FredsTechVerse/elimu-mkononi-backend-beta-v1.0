const bcrypt = require("bcrypt");

// MODELS SECTION
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorModel");
const Admin = require("../models/AdminModel");
const RefreshToken = require("../models/RefreshTokensModel");
const { handleError } = require("./ErrorHandling");
const { sendEmail } = require("../controllers/EmailController");
const { sendMessage } = require("../controllers/MessageController");

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
    let usersFound = [];
    const studentData = await Student.findOne({ email: req.body.email });
    const tutorData = await Tutor.findOne({ email: req.body.email });
    const adminData = await Admin.findOne({ email: req.body.email });

    if (studentData) {
      usersFound.push(studentData);
    }
    if (tutorData) {
      usersFound.push(tutorData);
    }
    if (adminData) {
      usersFound.push(adminData);
    }
    if (usersFound.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let matchedUser = null;

    // QUEST TO FIND SPECIFIC USER

    for (const userFound of usersFound) {
      const isPasswordsMatch = await bcrypt.compare(
        req.body.password,
        userFound.password
      );

      if (isPasswordsMatch) {
        const userInformation = {
          userID: userFound._id,
          email: userFound.email,
          surname: userFound.surname,
          role: userFound.role,
        };
        const accessToken = generateAccessToken(userInformation);
        const refreshToken = generateRefreshToken(userInformation);
        await RefreshToken.findOneAndUpdate(
          { name: "tokens" },
          { $push: { data: refreshToken } },
          { new: true, useFindAndModify: false, runValidation: true }
        );
        matchedUser = {
          accessToken,
          refreshToken,
          roles: [userInformation.role], //I am passing the user role inside and outside payload
        };

        if (userFound.isContactVerified && userFound.isEmailVerified) {
          res.status(200).json(matchedUser);
          break;
        } else {
          // We need to generate and send a new pair of email and contact verification codes
          const newEmailVerificationCode = generateRandomString(6);
          const newContactVerificationCode = generateRandomString(6);
          const newVerificationCodes = {
            contactVerificationCode: newContactVerificationCode,
            emailVerificationCode: newEmailVerificationCode,
          };

          const emailMessage = `Hello ${userFound.firstName.toUpperCase()},Tutor,${newEmailVerificationCode} is your email verification code.`;
          const message = `Hello ${userFound.firstName.toUpperCase()},${newContactVerificationCode} is your contact verification code.`;

          if (userFound.role === "EM-201") {
            await Student.findByIdAndUpdate(
              userFound._id,
              newVerificationCodes,
              {
                new: true,
                upsert: true,
              }
            );
          } else if (userFound.role === "EM-202") {
            await Tutor.findByIdAndUpdate(userFound._id, newVerificationCodes, {
              new: true,
              upsert: true,
            });
          } else if (userFound.role === "EM-203") {
            await Admin.findByIdAndUpdate(userFound._id, newVerificationCodes, {
              new: true,
              upsert: true,
            });
          }

          sendMessage({
            recipients: [userFound.contact],
            message: message,
            role: "EM-202",
          });
          sendEmail({
            to: [userFound.email],
            subject: "EMAIL VERIFICATION CODE FOR TUTOR ACCOUNT ON ELIMU HUB",
            text: emailMessage,
            role: "EM-202",
          });

          res.status(401).json({
            message: "Account not verified",
            userID: userFound._id,
            role: userFound.role,
          });
          break;
        }
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
    const { email, contact, role: passedRole } = req.body;
    let userData = null;

    if (passedRole === "EM-201") {
      userData = await Student.findOne({ email, role: passedRole, contact });
    } else if (passedRole === "EM-202") {
      userData = await Tutor.findOne({ email, role: passedRole, contact });
    } else if (passedRole === "EM-203") {
      userData = await Admin.findOne({ email, role: passedRole, contact });
    }

    if (!userData) {
      return res.status(404).json({ message: "Invalid Contact" });
    }

    // We generate the necessary credentials
    const resetToken = generateRandomString(6);
    const userID = userData?._id;
    const role = userData?.role;
    const userInformation = { resetToken, role, userID };
    const decryptUserRole = () => {
      if (role === "EM-201") {
        return "Student";
      } else if (role === "EM-202") {
        return "Tutor";
      } else if (role === "EM-203") {
        return "Admin";
      }
    };
    const accessToken = generateAccessToken(userInformation);
    const generatedResetToken = { resetToken };
    const message = `Hello ${
      userData?.firstName
    } ,${resetToken} is your password reset token for your ${decryptUserRole()} account, Elimu Hub`;

    sendEmail({
      to: [userData.email],
      subject: "PASSWORD RESET",
      text: message,
    });

    if (role === "EM-201") {
      await Student.findByIdAndUpdate(userID, generatedResetToken, {
        new: true,
        upsert: true,
      });
    } else if (role === "EM-202") {
      await Tutor.findByIdAndUpdate(userID, generatedResetToken, {
        new: true,
        upsert: true,
      });
    } else if (role === "EM-203") {
      await Admin.findByIdAndUpdate(userID, generatedResetToken, {
        new: true,
        upsert: true,
      });
    }
    return res.status(200).json({ role, userID, accessToken });
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
