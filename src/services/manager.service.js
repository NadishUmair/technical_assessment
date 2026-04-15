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

const registerManager = async (data) => {
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
    role: "manager",
    savedAddresses: data.savedAddresses || []
  });

  return user;
};


const createWorker = async (req, res) => {

  const hashed =
    await hashPassword(req.body.password);

  const worker = await User.create({
    name: req.body.name,
    phone: req.body.phone,
    password: hashed,
    role: "worker"
  });

  res.status(201).json({
    success: true,
    data: worker
  });
};


module.exports = {
   registerManager,
   createWorker
}