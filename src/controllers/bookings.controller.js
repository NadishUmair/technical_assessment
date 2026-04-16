const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  assignWorker,
  managerCancelBooking,
  managerCreateBooking,
  getWorkerBookings,
  uploadPhotos,
  markPaymentReceived,
  updateBookingStatus,

} = require("../services/bookings.service");



exports.createBooking = async (req, res, next) => {
  try {
    const data = await createBooking({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const data = await getMyBookings(req.user.id, req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const data = await getBookingById(req.params.id, req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const data = await cancelBooking(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const data = await getAllBookings(req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.assignWorker = async (req, res, next) => {
  try {
    const data = await assignWorker({
      bookingId: req.params.id,
      workerId: req.body.workerId,
      managerId: req.user.id,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.managerCancelBooking = async (req, res, next) => {
  try {
    const data = await managerCancelBooking({
      bookingId: req.params.id,
      reason: req.body.reason,
      adminId: req.user.id,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.managerCreateBooking = async (req, res, next) => {
  try {
    const data = await managerCreateBooking(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// worker bookings
exports.getWorkerBookings = async (req, res, next) => {
  try {
    const data = await getWorkerBookings(req.user.id, req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const data = await updateBookingStatus({
      bookingId: req.params.id,
      userId: req.user.id,
      newStatus: req.body.status,
    });
    
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.uploadPhotos = async (req, res, next) => {
  try {
    const data = await uploadPhotos({
      bookingId: req.params.id,
      files: req.files,
      userId: req.user.id,
    });
  
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.markPaymentReceived = async (req, res, next) => {
  try {
    const data = await markPaymentReceived(req.params.id,req.body.status, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
