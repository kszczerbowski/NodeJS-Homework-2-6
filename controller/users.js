import jwt from "jsonwebtoken";
import service from "../service/index.js";
import { signinUserSchema, signupUserSchema } from "./joiSchemas.js";
import fs from "fs";
import Jimp from "jimp";
import { sgMail, msg } from "./mail.js";

const signup = async (req, res, next) => {
  const allEmails = await service.getAllEmails();
  const { email } = req.body;

  if (allEmails.includes(email))
    return res.status(409).json({
      status: "failure",
      code: 409,
      message: "Email in use!",
    });

  const { error, value: newUserData } = signupUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: error.details.map((error) => error.message).join(" "),
    });

  try {
    const newUser = await service.addUser(newUserData);
    sgMail
      .send(
        msg(
          newUser.email,
          `http://localhost:3000/api/users/verify/${newUser.verificationToken}`
        )
      )
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    return res.status(201).json({
      status: "success",
      code: 201,
      data: { newUser },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const signin = async (req, res, next) => {
  const allEmails = await service.getAllEmails();
  const { email } = req.body;

  if (!allEmails.includes(email))
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: `No user with email ${email} has been found!`,
    });

  const { error, value: credentials } = signinUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: error.details.map((error) => error.message).join(" "),
    });

  try {
    const { userWithoutPassword, error } = await service.loginUser(credentials);
    if (!userWithoutPassword.verify)
      return res.status(401).json({
        status: "failure",
        code: 401,
        message: "E-mail address not verified!",
      });
    if (error)
      return res.status(401).json({
        status: "failure",
        code: 401,
        message: "Password incorrect!",
      });

    const token = jwt.sign(
      { id: userWithoutPassword._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    userWithoutPassword.token = token;

    return res.status(200).json({
      status: "success",
      code: 200,
      data: { userWithoutPassword },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const signout = async (req, res, next) => {
  try {
    const user = req.user;
    user.token = "";
    user.save();
    return res.status(204).json();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    const emailAndSubcriptionInfo = {
      email: user.email,
      subscription: user.subscription,
    };
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { emailAndSubcriptionInfo },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { file } = req.body;
  if (!file)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: "You need to pass body with file!",
    });
  try {
    await Jimp.read(req.file.path)
      .then((file) => {
        file.resize(250, 250).write(`../public/avatars/${file}`);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          status: "failure",
          code: 500,
          message: "Error encountered when saving the avatar!",
        });
      });

    fs.unlink(`../tmp/${file}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: "failure",
          code: 500,
          message:
            "Error encountered when trying to delete avatar from temp directory!",
        });
      }
      console.log("File deleted");
    });

    const user = req.user;
    user.avatarURL = `../public/avatars/${file}`;
    user.save();

    return res.status(200).json({
      status: "success",
      code: 200,
      data: { avatarURL: user.avatarURL },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const checkUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  if (!verificationToken)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: "Params need to include the verification token!",
    });

  try {
    const user = await service.getUserByVerificationToken(verificationToken);

    if (!user)
      return res
        .status(404)
        .json({ status: "failure", code: 404, message: "User not found" });

    user.verificationToken = null;
    user.verify = true;
    user.save();

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const applyForAnotherMail = async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    res.status(400).json({
      status: "failure",
      code: 400,
      message: "missing required field email",
    });

  const forgetfulUser = await service.getUserByEmail(email);

  if (!forgetfulUser)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: `User with email ${email} not found in the database!`,
    });

  if (forgetfulUser.verify)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: "Verification has already been passed!",
    });

  try {
    sgMail
      .send(
        msg(
          forgetfulUser.email,
          `http://localhost:3000/api/users/verify/${forgetfulUser.verificationToken}`
        )
      )
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    res
      .status(200)
      .json({
        status: "success",
        code: 200,
        message: "Verification email sent",
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default {
  signup,
  signin,
  signout,
  getCurrentUser,
  updateAvatar,
  checkUser,
  applyForAnotherMail,
};
