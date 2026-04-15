const Booking = require("../models/bookings.model");

const Service = require("../models/services.model");

const User = require("../models/auth.model");

const mongoose = require("mongoose");

const createBooking = async ({
  service,
  scheduledDate,
  timeSlot,
  address,
  problemDescription,
  userId,
}) => {
    if (!mongoose.Types.ObjectId.isValid(service)) {
    throw new Error("Invalid service ID format");
  }
  const svc = await Service.findById(service);

  if (!svc) {
    throw new Error("Service not found");
  }

  const count = await Booking.countDocuments({
    service,
    scheduledDate,
    timeSlot,
    status: { $ne: "cancelled" },
  });

  if (count >= svc.requiredTeamSize) {
    throw new Error("Slot not available");
  }

  return await Booking.create({
    service,
    customer: userId,
    scheduledDate,
    timeSlot,
    address,
    problemDescription,
    status: "pending",
    statusHistory: [
      {
        status: "pending",
        changedBy: userId,
      },
    ],
  });
};


// get my bookings service
const getMyBookings = async (userId, query) => {
  const { page = 1, limit = 10, status } = query;

  const filter = { customer: userId };

  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Booking.find(filter)
      .populate("service")
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page: Number(page),
    limit: Number(limit),
  };
};


const getBookingById = async (id, user) => {
  const booking = await Booking.findById(id)
    .populate("service")
    .populate("assignedWorker");

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Customer restriction
  if (
    user.role === "customer" &&
    booking.customer.toString() !== user.id
  ) {
    throw new Error("Unauthorized");
  }

  return booking;
};


// CANCLE BOOKING
const cancelBooking = async (id, userId) => {
  const booking = await Booking.findById(id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (!["pending", "confirmed"].includes(booking.status)) {
    throw new Error("Cannot cancel this booking");
  }

  booking.status = "cancelled";

  booking.statusHistory.push({
    status: "cancelled",
    changedBy: userId,
  });

  await booking.save();
  return booking;
};


// GET ALL BOOKINGS (manager)
const getAllBookings = async (query) => {
  const { page = 1, limit = 10, status, date, workerId, serviceId } =
    query;

  const filter = {};

  if (status) filter.status = status;
  if (date) filter.scheduledDate = date;
  if (workerId) filter.assignedWorker = workerId;
  if (serviceId) filter.service = serviceId;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Booking.find(filter)
      .populate("service")
      .populate("customer")
      .populate("assignedWorker")
      .skip(skip)
      .limit(limit),

    Booking.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page: Number(page),
    limit: Number(limit),
  };
};


// Assign worker
const assignWorker = async ({ bookingId, workerId, managerId }) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new Error("Booking not found");

  if (booking.status === "cancelled") {
    throw new Error("Cannot assign cancelled booking");
  }

  booking.assignedWorker = workerId;
  booking.status = "assigned";

  booking.statusHistory.push({
    status: "assigned",
    changedBy: managerId,
  });

  await booking.save();
  return booking;
};


// maanager cancel booking
const managerCancelBooking = async ({ bookingId, reason, adminId }) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new Error("Booking not found");

  booking.status = "cancelled";
  booking.cancelReason = reason;

  booking.statusHistory.push({
    status: "cancelled",
    changedBy: adminId,
  });

  await booking.save();
  return booking;
};

// manager create booking
const managerCreateBooking = async (data) => {
  const svc = await Service.findById(data.service);
    if (!svc) {
        throw new Error("Service not found");
    }

    const count = await Booking.countDocuments({
        service: data.service,
        scheduledDate: data.scheduledDate,
        timeSlot: data.timeSlot,
        status: { $ne: "cancelled" },
    });
    if (count >= svc.requiredTeamSize) {
        throw new Error("Slot not available");
    }

    const user = await User.findById(data.customer);
    if (!user) {
        throw new Error("Customer not found");
    }

    return await Booking.create({
        ...data,
        status: "pending",
        statusHistory: [
            {
                status: "pending",
                changedBy: data.createdBy,
            },
        ],
    });
}   



// worker bookings
const getWorkerBookings = async (workerId, query) => {
  const { status } = query;

  const filter = {
    assignedWorker: workerId,
  };

  if (status) filter.status = status;

  return {
    data: await Booking.find(filter).populate("service"),
  };
};

const updateBookingStatus = async ({
  bookingId,
  userId,
  newStatus,
}) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new Error("Booking not found");

  if (
    booking.assignedWorker.toString() !== userId
  ) {
    throw new Error("Unauthorized");
  }
  booking.status = newStatus;

  booking.statusHistory.push({
    status: newStatus,
    changedBy: userId,
  });

  await booking.save();
  return booking;
};


const uploadPhotos = async ({ bookingId, files }) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new Error("Booking not found");

  const urls = files.map((f) => f.path);

  booking.completionPhotos.push(...urls); // ✅ FIX HERE

  await booking.save();
  return booking;
};


const markPaymentReceived = async (id,status, userId) => {
  const booking = await Booking.findById(id);

  if (!booking) throw new Error("Booking not found");

  if (booking.status !== "completed") {
    throw new Error("Payment allowed only after completion");
  }

  booking.paymentStatus = status;

  await booking.save();
  return booking;
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  assignWorker,
  getAllBookings,
  managerCancelBooking,
  getWorkerBookings,
  managerCreateBooking,
  updateBookingStatus,
  uploadPhotos,
  markPaymentReceived,
};