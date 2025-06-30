import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("📦 Cookie Token:", token);

  if (!token) {
    return res.status(200).json({
      success: false,
      message: "Not logged in",
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
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
