const Joi = require("joi");

const newContactSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

const updatedContactSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string(),
  favorite: Joi.boolean(),
});

const updatedContactSchemaFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  newContactSchema,
  updatedContactSchema,
  updatedContactSchemaFavorite,
};
