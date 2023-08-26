const axios = require("axios");
const sendSms = async ({ firstName, contact }) => {
  try {
    console.log(`New user data ${JSON.stringify({ firstName, contact })}`);
    const config = {
      headers: {
        "Content-Type": "application/json",
        apikey: "9d1d8bb393c14550a5dfae8a2a1d5bd3",
      },
    };
    const smsPayload = {
      phone: "0112615416",
      message: `Thank you ${firstName} for registering on Elimu Hub `,
      recipient: [contact],
    };

    const { data } = await axios.post(
      "https://bulk-sms-production.up.railway.app/api/v1/sms/send",
      smsPayload,
      config
    );

    console.log(`SMS response data ${JSON.stringify(data)}`);
  } catch (err) {
    console.log(`SMS send error ${JSON.stringify(err)}`);
  }
};

module.exports = { sendSms };
