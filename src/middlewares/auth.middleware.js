const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");

const protect = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(401).json({
        success: false,
        message: "User not found"
      });

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;