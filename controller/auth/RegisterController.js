import User from "../../model/user/UserSchema.js";
import { validateUser } from "../../model/User/UserSchema.js";
import createToken from "../../utils/CreateToken.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Validate user data using Joi schema
    await validateUser({ firstName, lastName, email, password });

    const user = await User.register(
      firstName,
      lastName,
      email,
      password,
      role
    );

    // Create a JWT token
    const token = createToken(res, user._id);

    // send email verification
    const verificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    user.verificationToken = verificationToken;
    user.verificationTokenExpiration = Date.now() + 60 * 60 * 1000; // 1 hour

    // send verification email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Email verification for your account",
      html: `Please click this link to verify your email address: <a href="${process.env.BASE_URL}/api/v1/verify-email?token=${verificationToken}">Verify Email</a>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
    await user.save();

    // Send the JWT token in the response
    res.status(200).json({
      success: true,
      user: user,
      token: token,
      message: "Account Created",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export default registerUser;
