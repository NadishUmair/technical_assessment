const authService = require("../services/auth.service");

/* REGISTER */
exports.register = async (req, res, next) => {
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
exports.login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(
      req.body.phone,
      req.body.password
    );

    res.json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/* REFRESH TOKEN */
exports.refreshToken = async (req, res, next) => {
  try {
    const token = await authService.refreshAccessToken(
      req.body.refreshToken
    );

    res.json({
      success: true,
      message: "Token refreshed",
      data: { accessToken: token }
    });
  } catch (err) {
    next(err);
  }
};

/* LOGOUT */
exports.logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);

    res.json({
      success: true,
      message: "Logged out"
    });
  } catch (err) {
    next(err);
  }
};

/* GET ME */
exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

/* UPDATE ME */
exports.updateMe = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(
      req.user._id,
      req.body
    );

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

/* CHANGE PASSWORD */
exports.changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(
      req.user._id,
      req.body.oldPassword,
      req.body.newPassword
    );

    res.json({
      success: true,
      message: "Password changed"
    });
  } catch (err) {
    next(err);
  }
};


