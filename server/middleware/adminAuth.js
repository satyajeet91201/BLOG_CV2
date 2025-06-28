import User from "../models/userModel.js";

export const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    // ✅ Set your email as admin
    if (user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ success: false, message: "Only admin can perform this action" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
