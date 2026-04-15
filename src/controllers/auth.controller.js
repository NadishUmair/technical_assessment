const authService = require("../services/auth.service");

/* REGISTER */
const register = async (req, res, next) => {
  try {
    const user = await authService.registerCustomer(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
};

/* LOGIN */
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(
      req.body.phone,
      req.body.password
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/* REFRESH TOKEN */
const refreshToken = async (req, res, next) => {
  try {
    const token = await authService.refreshAccessToken(
      req.body.refreshToken
    );

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: {
        accessToken: token
      }
    });
  } catch (err) {
    next(err);
  }
};

/* LOGOUT */
const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (err) {
    next(err);
  }
};

/* GET ME */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
};

/* UPDATE ME */
const updateMe = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
};

/* CHANGE PASSWORD */
const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(
      req.user._id,
      req.body.oldPassword,
      req.body.newPassword
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateMe,
  changePassword
};