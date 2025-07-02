import User from "../models/userModel.js";

export const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    // Allow both 'admin' and 'main-admin'
    if (user.role === "admin" || user.role === "main-admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Only admins can perform this action",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
