const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    label: String,
    addressLine: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    email: {
      type: String,
      unique: true,
      sparse: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["customer", "manager", "worker"],
      default: "customer"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    profilePhoto: String,

    savedAddresses: [addressSchema],

    loyaltyPoints: {
      type: Number,
      default: 0
    },

    refreshToken: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);