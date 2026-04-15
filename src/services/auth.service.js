const User = require("../models/auth.model");

const {
  hashPassword,
  comparePassword
} = require("../utils/password");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");

const jwt = require("jsonwebtoken");

/* REGISTER */

const registerCustomer = async (data) => {
  const existingUser =
    await User.findOne({
      phone: data.phone
    });

  if (existingUser)
    throw new Error("Phone already exists");

  const hashed =
    await hashPassword(data.password);

  const user = await User.create({
    name: data.name,
    phone: data.phone,
    password: hashed,
    role: "customer"
  });

  return user;
};

/* LOGIN */

const loginUser = async (
  phone,
  password
) => {
  const user =
    await User.findOne({ phone });

  if (!user)
    throw new Error("User not found");

  const isMatch =
    await comparePassword(
      password,
      user.password
    );

  if (!isMatch)
    throw new Error("Invalid credentials");

  const accessToken =
    generateAccessToken(user);

  const refreshToken =
    generateRefreshToken(user);

  user.refreshToken = refreshToken;

  await user.save();

  return {
    user,
    accessToken,
    refreshToken
  };
};

/* REFRESH TOKEN */

const refreshAccessToken = async (
  refreshToken
) => {
  if (!refreshToken)
    throw new Error("No token");

  const decoded =
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

  const user =
    await User.findById(
      decoded.id
    );

  if (
    !user ||
    user.refreshToken !== refreshToken
  )
    throw new Error(
      "Invalid refresh token"
    );

  const newAccessToken =
    generateAccessToken(user);

  return newAccessToken;
};

/* LOGOUT */

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      refreshToken: null
    }
  );
};

/* GET PROFILE */

const getProfile = async (userId) => {
  return User.findById(userId)
    .select("-password -refreshToken");
};

/* UPDATE PROFILE */

const updateProfile = async (
  userId,
  data
) => {
  return User.findByIdAndUpdate(
    userId,
    data,
    { new: true }
  ).select("-password -refreshToken");
};

/* CHANGE PASSWORD */

const changePassword = async (
  userId,
  oldPassword,
  newPassword
) => {
  const user =
    await User.findById(userId);

  const isMatch =
    await comparePassword(
      oldPassword,
      user.password
    );

  if (!isMatch)
    throw new Error(
      "Old password incorrect"
    );

  user.password =
    await hashPassword(newPassword);

  await user.save();
};

module.exports = {
  registerCustomer,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getProfile,
  updateProfile,
  changePassword
};