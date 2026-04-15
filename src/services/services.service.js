

const Service = require("../models/services.model");




// Get All Services


const getAllServices = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [services, total] = await Promise.all([
    Service.find({ isActive: true })
      .skip(skip)
      .limit(limit),
    Service.countDocuments({ isActive: true }),
  ]);

  return {
    data: services,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};



// Get by Slug
const getServiceBySlug = async (slug) => {
  const service = await Service.findOne({
    slug,
    isActive: true,
  });

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

// Get Categories
const getCategories = async () => {
  return await Service.distinct("category");
};

// Create Service
const createService = async (data, userId) => {
  return await Service.create({
    ...data,
    createdBy: userId,
  });
};

// Update Service
const updateService = async (id, data) => {
  return await Service.findByIdAndUpdate(id, data, {
    new: true,
  });
};

// Toggle Active Status
const toggleService = async (id) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new Error("Service not found");
  }

  service.isActive = !service.isActive;
  await service.save();

  return service;
};

// Soft Delete
const deleteService = async (id) => {
  return await Service.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};

module.exports = {
  getAllServices,
  getServiceBySlug,
  getCategories,
  createService,
  updateService,
  toggleService,
  deleteService,
};
