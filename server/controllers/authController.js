import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User with this email already exists", 409));
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
      text: `Hi ${name},\n\nYour account has been successfully created.\n\n– Smart Blog Team`
    });
  } catch (err) {
    emailStatus = "failed";
  }

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "Success",
    message: "New user created",
    newUser,
    emailStatus
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found. Please register first.", 404));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Incorrect password", 401));
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

  res.status(200).json({
    status: "Success",
    message: "Logged in successfully",
    user,
    token,
  });
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    status: true,
    message: "Successfully logged out",
  });
});

export const sendVerifyOtp = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) return next(new AppError("User not found", 404));
  if (user.isAccountVerified) {
    return next(new AppError("Account already verified", 400));
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
      text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}\n\nExpires in 24 hours.\n\n– Smart Blog Team`,
    });
  } catch (err) {
    emailStatus = "failed";
  }

  res.status(200).json({
    success: true,
    message: `Verification OTP sent (${emailStatus})`,
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const { otp } = req.body;

  if (!userId || !otp) {
    return next(new AppError("Missing details", 400));
  }

  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found", 404));

  if (user.verifyOTpExpireAt < Date.now()) {
    return next(new AppError("OTP has expired", 400));
  }

  if (user.verifyOTp !== otp) {
    return next(new AppError("Incorrect OTP. Verification failed", 400));
  }

  user.isAccountVerified = true;
  user.verifyOTp = null;
  user.verifyOTpExpireAt = null;
  await user.save();

  res.status(200).json({
    status: true,
    message: "Your account is verified",
  });
});

export const isAuthenticated = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated and logged in"
  });
});

export const sendResetOtp = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new AppError("User not found", 404));

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.verifyOTp = otp;
  user.verifyOTpExpireAt = Date.now() + 10 * 60 * 1000;
  await user.save();

  let emailStatus = "sent";
  try {
    await sendEmail({
      to: user.email,
      subject: `Smart Blog Password Reset OTP`,
      text: `Hello ${user.name},\n\nYour OTP for password reset is: ${otp}\n\nExpires in 10 minutes.\n\n– Smart Blog Team`,
    });
  } catch (err) {
    emailStatus = "failed";
  }

  res.status(200).json({
    success: true,
    message: `Password reset OTP sent (${emailStatus})`,
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return next(new AppError("Mention all details properly", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User does not exist with this email", 404));
  }

  if (otp !== user.verifyOTp || Date.now() < user.verifyOTpExpireAt) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  user.password = await bcrypt.hash(newPassword, 8);
  user.verifyOTp = null;
  user.verifyOTpExpireAt = null;

  await user.save();

  res.status(200).json({
    status: true,
    message: "Your password is updated"
  });
});
