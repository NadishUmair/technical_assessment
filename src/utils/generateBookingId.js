const Booking = require("../models/Booking");

const generateBookingId = async () => {
  const year = new Date().getFullYear();

  const count = await Booking.countDocuments();

  const number = String(count + 1).padStart(5, "0");

  return `HSP-${year}-${number}`;
};

module.exports = generateBookingId;