const axios = require("axios");
const confirmUserRegistration = async ({ firstName, contact, role }) => {
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
      message: `Congratulations ${firstName} for successfully registering as ${
        role === "admin" ? "an" : "a"
      } ${role} on Elimu Hub.`,
      recipient: [contact],
    };

    const { data } = await axios.post(
      "https://bulk-sms-production.up.railway.app/api/v1/sms/send",
      smsPayload,
      config
    );

    console.log(`SMS response data ${JSON.stringify(data)}`);
  } catch (err) {
    // I will only invoke users attention if an error is present.
    console.log(`SMS send error ${JSON.stringify(err)}`);
  }
};

module.exports = { confirmUserRegistration };
