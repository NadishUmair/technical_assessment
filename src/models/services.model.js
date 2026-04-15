const mongoose = require("mongoose");
const slugify = require("slugify");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    slug: {
      type: String,
      unique: true
    },

    category: {
      type: String,
      required: true
    },

    description: String,

    basePrice: {
      type: Number,
      required: true,
      min: 0
    },

    estimatedDurationMinutes: {
      type: Number,
      required: true
    },

    requiredTeamSize: {
      type: Number,
      default: 1
    },

    photos: [String],

    isActive: {
      type: Boolean,
      default: true
    },

    tags: [String],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);



// Auto-generate slug
serviceSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});


module.exports =
  mongoose.model(
    "Service",
    serviceSchema
  );