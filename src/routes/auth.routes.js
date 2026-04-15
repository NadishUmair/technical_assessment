const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/auth.controller");

const protect =
  require("../middlewares/auth.middleware");

/* PUBLIC */

router.post(
  "/register",
  controller.register
);

router.post(
  "/login",
  controller.login
);

router.post(
  "/refresh-token",
  controller.refreshToken
);

/* PRIVATE */

router.post(
  "/logout",
  protect,
  controller.logout
);

router.get(
  "/me",
  protect,
  controller.getMe
);

router.patch(
  "/me",
  protect,
  controller.updateMe
);

router.post(
  "/change-password",
  protect,
  controller.changePassword
);

module.exports = router;