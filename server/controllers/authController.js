import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  console.log("Reached");
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "Fail",
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    let emailStatus = "sent";
    try {
      await sendEmail({
        to: email,
        subject: `Welcome to Smart Blog, ${name}!`,
        text: `Hi ${name},\n\nYour account has been successfully created.\n\nThank you for joining us!\n\n– Smart Blog Team`
      });
      console.log(`📩 Email sent to ${email}`);
    } catch (emailError) {
      console.error("❌ Email failed:", emailError.message || emailError);
      emailStatus = "failed";
    }

    console.log(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Success",
      message: "New user created and email sent",
      newUser,
      emailStatus
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Success",
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      status: true,
      message: "Successfully logged out",
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (user.isAccountVerified) {
      return res.status(400).json({
        status: "Fail",
        message: "Account already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTp = otp;
    user.verifyOTpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    let emailStatus = "sent";
    try {
      await sendEmail({
        to: user.email,
        subject: `Your Smart Blog Verification OTP`,
        text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}\n\nThis OTP will expire in 24 hours.\n\n– Smart Blog Team`,
      });
      console.log(`📩 OTP Email sent to ${user.email}`);
    } catch (emailErr) {
      console.error("❌ OTP Email sending failed:", emailErr.message || emailErr);
      emailStatus = "failed";
    }

    return res.status(200).json({
      success: true,
      message: `Verification OTP sent via email (${emailStatus})`,
    });
  } catch (err) {
    return res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  console.log("Verify email controler", userId);
  const { otp } = req.body;
  console.log(otp);

  if (!userId || !otp) {
    return res.status(404).json({
      status: "Fail",
      message: "Missing Details"
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }

    if (user.verifyOTpExpireAt < Date.now()) {
      return res.status(404).json({
        status: "Fail",
        message: "OTP has expired",
      });
    }

    if (user.verifyOTp === otp) {
      user.isAccountVerified = true;
      user.verifyOTp = null;
      user.verifyOTpExpireAt = null;
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Your account is verified"
      });
    } else {
      res.status(404).json({
        status: "Fail",
        message: "Your account is not verified. Enter correct OTP."
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

export const isAuthenticated = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "You are authenticated and logged in"
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTp = otp;
    user.verifyOTpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    let emailStatus = "sent";
    try {
      await sendEmail({
        to: user.email,
        subject: `Smart Blog Password Reset OTP`,
        text: `Hello ${user.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\n– Smart Blog Team`,
      });
      console.log(`📩 Password reset OTP sent to ${user.email}`);
    } catch (emailErr) {
      console.error("❌ OTP email sending failed:", emailErr.message || emailErr);
      emailStatus = "failed";
    }

    return res.status(200).json({
      success: true,
      message: `Password reset OTP sent via email (${emailStatus})`,
    });
  } catch (err) {
    console.error("🔴 sendResetOtp Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};


export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(404).json({
      status: false,
      message: "Mention all the details properly"
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "User does not exist with mentioned email id"
      });
    }

    if (otp === user.verifyOTp && Date.now() < user.verifyOTpExpireAt) {
      const hashedPassword = await bcrypt.hash(newPassword, 8);
      user.password = hashedPassword;
      user.verifyOTp = null;
      user.verifyOTpExpireAt = null;

      await user.save();

      return res.status(200).json({
        status: true,
        message: "Your password is updated"
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Pls enter correct otp. Murkha Manus !"
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};