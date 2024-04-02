import asyncHandler from "express-async-handler";
import User from "../Models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import generateToken from "../utils/generateToken.js";
import { joinTeam } from "./teamController.js";
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public

const authUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, password, phone, gradution, college, Branch } = req.body;
  const email = req.body.email.toLowerCase();
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    email,
    name,
    password,
    phone,
    gradution,
    college,
    Branch,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc  Logout user
// @route POST /api/users/logout
// @access Private

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
  });

  res.status(200).json({ message: "User Logged Out" });
});

// @desc  Get user profile
// @route GET /api/users/profile
// @access Private

const forgetpassword = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json("User does not exist");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Jashan.maybe76@gmail.com",
      pass: "",
    },
  });

  var mailOptions = {
    from: "Jashan.maybe76@gmail.com",
    to: email,
    subject: "Reset Password Link",
    text: `http://localhost:5173/reset-password/${user._id}/${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error("Error sending email");
    } else {
      return res.status(200).json("Mail sent Successfully");
    }
  });
});

const resetpassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { id, token } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.send({ Status: "User does not exist" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    try {
      // Hash the new password before updating it in the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user's password with the hashed password
      await User.findByIdAndUpdate(id, { password: hashedPassword });
      return res.status(200).json("Password reset successfully");
    } catch (err) {
      return res.status(400).json("Error resetting password");
    }
  } else {
    return res.status(400).json("Invalid or Expired Token");
  }
});

export { authUser, registerUser, logoutUser, forgetpassword, resetpassword };
