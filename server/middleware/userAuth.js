import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("📦 Cookie Token:", token);

  if (!token) {
    return res.status(400).json({
      success: false,
      msg: "Not Authorized",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decodedToken);

    if (decodedToken?.id) {
      req.userId = decodedToken.id;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};
