import Joi from "joi";

export const newContactSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

export const updatedContactSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string(),
  favorite: Joi.boolean(),
});

export const updatedContactSchemaFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});
