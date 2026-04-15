const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),

  password: Joi.string()
    .min(6)
    .required()
});

const loginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  profilePhoto: Joi.string().uri().optional()
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(6)
    .required()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
};