require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/auth.model");


const seedManager = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB Connected");

    // Check if manager already exists
    const existingManager =
      await User.findOne({
        role: "manager"
      });

    if (existingManager) {
      console.log("Manager already exists");
      process.exit();
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash("admin123", 10);

    // Create manager
    const manager =
      await User.create({
        name: "Super Manager",
        phone: "03000000000",
        email: "manager@example.com",
        password: hashedPassword,
        role: "manager"
      });

    console.log(
      "Manager created successfully"
    );

    console.log("Login credentials:");
    console.log("Phone:", manager.phone);
    console.log("Password: admin123");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedManager();