const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
  {
    status: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    addressLine: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "assigned",
        "on_the_way",
        "in_progress",
        "completed",
        "cancelled"
      ],
      default: "pending"
    },

    scheduledDate: {
      type: Date,
      required: true
    },

    timeSlot: {
      type: String,
      required: true
    },

    address: addressSchema,

    problemDescription: String,

    preVisitPhotos: [String],

    completionPhotos: [String],

    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "received", "failed"],
      default: "pending"
    },

    totalAmount: Number,

    promoCode: String,

    discountAmount: {
      type: Number,
      default: 0
    },

    cancellationReason: String,

    workerNotes: String,

    statusHistory: [statusHistorySchema]
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model("Booking", bookingSchema);