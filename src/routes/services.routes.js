const router = require("express").Router();





const serviceController =
  require("../controllers/services.controller");
const protect = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/requiredRole");



// Public Routes
router.get(
  "/services",
  serviceController.getServices
);

router.get(
  "/categories",
  serviceController.getCategories
);

router.get( "/:slug",
  serviceController.getServiceBySlug
);



// Manager Routes
router.post(
  "/create-service",
  protect,
  requireRole("manager"),
  serviceController.createService
);

router.patch(
  "/update-service/:id",
  protect,
  requireRole("manager"),
  serviceController.updateService
);

router.patch(
  "/:id/toggle",
  protect,
  requireRole("manager"),
  serviceController.toggleService
);

router.delete(
  "/:id",
  protect,
  requireRole("manager"),
  serviceController.deleteService
);

module.exports = router;