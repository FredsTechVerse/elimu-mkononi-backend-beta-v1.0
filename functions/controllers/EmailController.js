const nodemailer = require("nodemailer");
const sendEmail = async (req, res) => {
  try {
    const { contacts, subject, text } = req.body;
    let areAllEmailsSent = false;

    const html = `  <p className="test">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
        obcaecati.
        <a
          href="http://localhost:3000"
          style={{
            backgroundColor: "blue",
            display: "block",
            color: "white",
            height: "50px",
            width: "250px",
          }}
        >
          Go to home
        </a>
      </p>`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gichia.alfred20@students.dkut.ac.ke",
        pass: "E022-01-1027/2020",
      },
    });

    const emailConfig = {
      from: "gichia.alfred20@students.dkut.ac.ke",
      to: contacts,
      subject: subject,
      text: text,
      // html: html,
    };
    const info = await transporter.sendMail(emailConfig);
    contacts.map((contact) => {
      if (info.accepted.includes(contact)) {
        areAllEmailsSent = true;
      } else {
        areAllEmailsSent = false;
      }
    });
    if (areAllEmailsSent) {
      res.status(200).json({
        message: "Email successfully sent",
        acceptedEmails: info.accepted,
      });
    } else {
      res.status(500).json({
        message: "Some emails have not been sent",
        rejectedEmails: info.rejected,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const sendEmailVerificationCode = async ({
  firstName,
  role,
  subject,
  emailVerificationCode,
  emails,
}) => {
  try {
    let areAllEmailsSent = false;

    const message = `Hello ${firstName} (${role}) ,${emailVerificationCode} is your email verification code for your Elimu Hub account`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gichia.alfred20@students.dkut.ac.ke",
        pass: "E022-01-1027/2020",
      },
    });

    const emailConfig = {
      from: "gichia.alfred20@students.dkut.ac.ke",
      to: emails,
      subject: subject,
      text: message,
    };
    const info = await transporter.sendMail(emailConfig);
    emails.map((contact) => {
      if (info.accepted.includes(contact)) {
        areAllEmailsSent = true;
      } else {
        areAllEmailsSent = false;
      }
    });
    if (areAllEmailsSent) {
      console.log(
        `Email success ${JSON.stringify({ rejectedEmails: info.rejected })}`
      ); // res.status(200).json({
      //   message: "Email successfully sent",
      //   acceptedEmails: info.accepted,
      // });
    } else {
      console.log(
        `Email failure ${JSON.stringify({ rejectedEmails: info.rejected })}`
      );
      // res.status(500).json({
      //   message: "Some emails have not been sent",
      //   rejectedEmails: info.rejected,
      // });
    }
  } catch (error) {
    console.log(error);
  }
};

const sendResetToken = async ({
  firstName,
  emails,
  subject,
  role,
  resetToken,
}) => {
  console.log(
    `Reset Token Information ${JSON.stringify({
      firstName,
      role,
      subject,
      resetToken,
      emails,
    })}`
  );
  try {
    let areAllEmailsSent = false;

    const message = `Hello ${firstName} ,${resetToken} is your password reset token for your (${role}) on Elimu Hub.`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gichia.alfred20@students.dkut.ac.ke",
        pass: "E022-01-1027/2020",
      },
    });

    const emailConfig = {
      from: "gichia.alfred20@students.dkut.ac.ke",
      to: emails,
      subject: subject,
      text: message,
    };
    const info = await transporter.sendMail(emailConfig);
    emails.map((contact) => {
      if (info.accepted.includes(contact)) {
        areAllEmailsSent = true;
      } else {
        areAllEmailsSent = false;
      }
    });
    if (areAllEmailsSent) {
      console.log(
        `Email success ${JSON.stringify({ rejectedEmails: info.rejected })}`
      );
    } else {
      console.log(
        `Email failure ${JSON.stringify({ rejectedEmails: info.rejected })}`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail, sendEmailVerificationCode, sendResetToken };
