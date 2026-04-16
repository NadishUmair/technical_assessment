const express = require("express");
const protect = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/requiredRole");
const bookingController = require("../controllers/bookings.controller");
const upload = require("../helpers/upload");

const router = express.Router();

console.log("bookingcontroller",bookingController);
//
// 🔹 CUSTOMER ROUTES
//

// Create booking
router.post(
  "/",
  protect,
  requireRole("customer"),
  bookingController.createBooking
);

// Get my bookings (with filters + pagination)
router.get(
  "/my",
  protect,
  requireRole("customer"),
  bookingController.getMyBookings
);

// Get single booking
router.get(
  "/:id",
  protect,
  bookingController.getBookingById
);

// Cancel booking
router.patch(
  "/:id/cancel",
  protect,
  requireRole("customer"),
  bookingController.cancelBooking
);


//
// 🔹 MANAGER ROUTES
//

// List all bookings
router.get(
  "/manager/bookings",
  protect,
  requireRole("manager"),
  bookingController.getAllBookings
);

// Assign / Reassign worker
router.patch(
  "/manager/bookings/:id/assign",
  protect,
  requireRole("manager"),
  bookingController.assignWorker
);

// Cancel any booking
router.patch(
  "/manager/bookings/:id/cancel",
  protect,
  requireRole("manager"),
  bookingController.managerCancelBooking
);

// Create booking manually
router.post(
  "/manager/bookings",
  protect,
  requireRole("manager"),
  bookingController.managerCreateBooking
);


//
// 🔹 WORKER ROUTES
//

// Get assigned bookings
router.get(
  "/worker/bookings",
  protect,
  requireRole("worker"),
  bookingController.getWorkerBookings
);

// Update booking status
router.patch(
  "/worker/bookings/:id/status",
  protect,
  requireRole("worker"),
  bookingController.updateBookingStatus
);

// Upload photos
router.post(
  "/worker/bookings/:id/photos",
  protect,
  requireRole("worker"),
  upload.array("photos", 10),
  bookingController.uploadPhotos
);

// Mark payment received
router.patch(
  "/worker/booking-payment/:id",
  protect,
  requireRole("worker"),
  bookingController.markPaymentReceived
);

module.exports = router;