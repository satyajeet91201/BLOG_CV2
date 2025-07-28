import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// GET /api/users
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "Success",
    users,
  });
});

// GET /api/users/me
export const getUserData = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "Success",
    userData: {
      _id: user._id,
      Name: user.name,
      IsVerified: user.isAccountVerified,
      Email: user.email,
      role: user.role
    }
  });
});
