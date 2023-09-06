const nodemailer = require("nodemailer");
const Email = require("../models/EmailModel");

const sendEmail = async ({ to: emails, subject, text }) => {
  try {
    console.log({ emails, subject, text });
    let areAllEmailsSent = false;
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
      text: text,
    };
    const info = await transporter.sendMail(emailConfig);
    if (info.accepted.length > 0) {
      const emailData = await Email.create({
        from: "gichia.alfred20@students.dkut.ac.ke",
        to: info.accepted,
        subject: subject,
        text: text,
        status: "delivered",
      });
      emailData.save();
    }
    if (info.rejected.length > 0) {
      const emailData = await Email.create({
        from: "gichia.alfred20@students.dkut.ac.ke",
        to: info.rejected,
        subject: subject,
        text: text,
        status: "rejected",
      });
      emailData.save();
    }
    emails.map((contact) => {
      if (info.accepted.includes(contact)) {
        areAllEmailsSent = true;
      } else {
        areAllEmailsSent = false;
      }
    });
    if (areAllEmailsSent) {
      console.log(
        `Email success ${JSON.stringify({ acceptedEmails: info.accepted })}`
      );
    } else {
      console.log(
        `Email failure ${JSON.stringify({ rejectedEmails: info.rejected })}`
      );
    }
  } catch (error) {
    console.log(error.message);
  }
};
const sendEmailController = async (req, res) => {
  try {
    const { to: contacts, subject, text } = req.body;
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
    if (info.accepted.length > 0) {
      const emailData = await Email.create({
        from: "gichia.alfred20@students.dkut.ac.ke",
        to: info.accepted,
        subject: subject,
        text: text,
        status: "delivered",
      });
      emailData.save();
    }
    if (info.rejected.length > 0) {
      const emailData = await Email.create({
        from: "gichia.alfred20@students.dkut.ac.ke",
        to: info.rejected,
        subject: subject,
        text: text,
        status: "rejected",
      });
      emailData.save();
    }

    contacts.map((contact) => {
      if (info.accepted.includes(contact)) {
        areAllEmailsSent = true;
      } else {
        areAllEmailsSent = false;
      }
    });

    if (areAllEmailsSent) {
      res.status(200).json({
        message: "All emails have been delivered",
        acceptedEmails: info.accepted,
      });
    } else {
      res.status(200).json({
        message: "Some emails have been delivered",
        rejectedEmails: info.rejected,
        acceptedEmails: info.accepted,
      });
    }
  } catch (error) {
    console.log(`Error while sending emails ${JSON.stringify(error)}`);
  }
};

module.exports = {
  sendEmail,
  sendEmailController,
};
