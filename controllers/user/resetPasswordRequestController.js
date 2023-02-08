const User = require("../../models/user");
const nodeMailer = require("nodemailer");
const nodeMailerSendGrid = require("nodemailer-sendgrid-transport");

const resetPasswordRequestController = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("No User is registered with this email.");
    }
    const transport = nodeMailer.createTransport(
      nodeMailerSendGrid({
        auth: {
          apiKey: process.env.SENDGRID_API_KEY,
        },
      })
    );
    transport.sendMail(
      {
        from: process.env.SENDGRID_MAIL,
        to: email,
        subject: "PASSWORD RESET LINK : Crime Record Application",
        text: "This link is only valid for 30 mins",
        html: "<h1>Hello world!</h1>",
      },
      (err) => {
        console.log("The error message => ", err.message);
      }
    );
    res.json({
      message: "Email sent successfully.",
    });
    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};
module.exports = resetPasswordRequestController;
