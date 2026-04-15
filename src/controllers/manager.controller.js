const managerService = require("../services/manager.service");



exports.createManager = async (req, res, next) => {
  try {
    const user = await managerService.registerManager(req.body);

    res.status(201).json({
      success: true,
      message: "Manager registered successfully",
      data: user
    });
  }
    catch (err) { 
      next(err);
    }
  }


exports.createWorker = async (req, res, next) => {
    try {
      const worker = await managerService.createWorker(req, res);

      res.status(201).json({
        success: true,
        message: "Worker created successfully",
        data: worker
      });
    }
    catch (err) {
      next(err);
    }
  }