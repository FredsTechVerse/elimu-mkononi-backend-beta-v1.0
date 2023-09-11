const nodemailer = require("nodemailer");
const Email = require("../models/EmailModel");
const { handleError } = require("./ErrorHandling");

const sendEmail = async ({ to: emails, subject, text, role }) => {
  console.log(
    `Sending email ${JSON.stringify({ emails, subject, text, role })}`
  );
  // HTML BODY SAMPLE (sent as {html:html} instead of {text:text})
  // const html = `  <p className="test">
  //   Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
  //   obcaecati.
  //   <a
  //     href="http://localhost:3000"
  //     style={{
  //       backgroundColor: "blue",
  //       display: "block",
  //       color: "white",
  //       height: "50px",
  //       width: "250px",
  //     }}
  //   >
  //     Go to home
  //   </a>
  // </p>`;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailConfig = {
      from: process.env.EMAIL_ACCOUNT,
      to: emails,
      subject: subject,
      text: text,
    };
    const info = await transporter.sendMail(emailConfig);
    if (info.accepted.length > 0) {
      const emailData = await Email.create({
        from: process.env.EMAIL_ACCOUNT,
        to: info.accepted,
        subject,
        text,
        role,
        status: "delivered",
      });
      emailData.save();
    }
    if (info.rejected.length > 0) {
      const emailData = await Email.create({
        from: process.env.EMAIL_ACCOUNT,
        to: info.rejected,
        subject,
        text,
        role,
        status: "rejected",
      });
      emailData.save();
    }

    return { acceptedEmails: info.accepted, rejectedEmails: info.rejected };
  } catch (error) {
    console.log(
      `Error while sending email messages ${JSON.stringify(error.message)}`
    );
  }
};
const sendEmailController = async (req, res) => {
  const { to: emails, subject, text } = req.body;
  const response = await sendEmail({ emails, subject, text });
  if (response.rejectedEmails.length === 0) {
    res.status(200).json({
      message: "All emails have been delivered",
      acceptedEmails: response.acceptedEmails,
    });
  } else {
    res.status(200).json({
      message: "Some emails have not been delivered",
      rejectedEmails: response.rejectedEmails,
      acceptedEmails: response.acceptedEmails,
    });
  }
};

const findAllEmails = async (req, res) => {
  try {
    const emailData = await Email.find();
    res.status(200).send(emailData);
  } catch (err) {
    handleError(err);
  }
};

module.exports = {
  sendEmail,
  sendEmailController,
  findAllEmails,
};
