const Booking = require("../models/Booking");

const checkSlotAvailability = async (
  service,
  date,
  timeSlot
) => {

  const count = await Booking.countDocuments({
    service,
    scheduledDate: date,
    timeSlot,
    status: { $ne: "cancelled" }
  });

  return count;
};

module.exports = checkSlotAvailability;