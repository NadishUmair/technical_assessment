const router = require("express").Router();





const serviceController =
  require("../controllers/services.controller");
const protect = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/requiredRole");



// Public Routes
router.get(
  "/all-services",
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
  "/toggle-service/:id",
  protect,
  requireRole("manager"),
  serviceController.toggleService
);

router.delete(
  "/delete-service/:id",
  protect,
  requireRole("manager"),
  serviceController.deleteService
);

module.exports = router;