const sgMail = require("@sendgrid/mail");
const sendEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  return sgMail.send({
    from: 'Tour Explorer <hamza.aziz8750@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
