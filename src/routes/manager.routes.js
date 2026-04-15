
const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/manager.controller");

const protect =
  require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/requiredRole");

router.post(
  "/create-manager",
  protect,
  requireRole("manager"),
  controller.createManager
);

router.post(
  "/create-worker",
  protect,
  requireRole("manager"),
  controller.createWorker
);


module.exports = router;