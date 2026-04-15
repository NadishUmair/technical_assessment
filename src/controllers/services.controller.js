

// controllers/service.controller.js

const {
  getAllServices,
  getServiceBySlugService,
  getCategoriesService,
  createService,
  updateService,
  toggleService,
  deleteService,
} = require("../services/services.service");


// controllers/service.controller.js


// Get All Services
exports.getServices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getAllServices(page, limit);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// Get Service by Slug
exports.getServiceBySlug = async (req, res, next) => {
  try {
    const service = await getServiceBySlugService(
      req.params.slug
    );

    res.json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// Get Categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories =
      await getCategoriesService();

    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// Create Service
exports.createService = async (req, res, next) => {
  try {
    const service =
      await createService(
        req.body,
        req.user.id
      );

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// Update Service
exports.updateService = async (req, res, next) => {
  try {
    const service =
      await updateService(
        req.params.id,
        req.body
      );

    res.json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// Toggle Service
exports.toggleService = async (req, res, next) => {
  try {
    const service =
      await toggleService(
        req.params.id
      );

    res.json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Service
exports.deleteService = async (req, res, next) => {
  try {
    await deleteService(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Service deleted (soft)",
    });
  } catch (err) {
    next(err);
  }
};


