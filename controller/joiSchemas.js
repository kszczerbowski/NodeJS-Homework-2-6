import Joi from "joi";

const wrongType = (property, correctType) =>
  `'${property}' should be a type of '${correctType}'!`;
const emptyField = (property) => `'${property}' cannot be an empty field!`;
const requiredField = (property) => `'${property}' is a required field!`;

const SUBSCRIPTION_TYPES = ["starter", "pro", "business"];

export const newContactSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.base": wrongType("name", "string"),
      "string.empty": emptyField("name"),
      "any.required": requiredField("name"),
    }),
  phone: Joi.string()
    .required()
    .messages({
      "string.base": wrongType("phone", "string"),
      "string.empty": emptyField("phone"),
      "any.required": requiredField("phone"),
    }),
  email: Joi.string()
    .required()
    .messages({
      "string.base": wrongType("email", "string"),
      "string.empty": emptyField("email"),
      "any.required": requiredField("email"),
    }),
  favorite: Joi.boolean()
    .required()
    .messages({
      "boolean.base": wrongType("favorite", "boolean"),
      "boolean.empty": emptyField("favorite"),
      "any.required": requiredField("favorite"),
    }),
});

export const updatedContactSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": wrongType("name", "string"),
    "string.empty": emptyField("name"),
  }),
  phone: Joi.string().messages({
    "string.base": wrongType("phone", "string"),
    "string.empty": emptyField("phone"),
  }),
  email: Joi.string().messages({
    "string.base": wrongType("email", "string"),
    "string.empty": emptyField("email"),
  }),
  favorite: Joi.boolean().messages({
    "boolean.base": wrongType("favorite", "boolean"),
    "boolean.empty": emptyField("favorite"),
  }),
});

export const updatedContactSchemaFavorite = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({
      "boolean.base": wrongType("favorite", "boolean"),
      "boolean.empty": emptyField("favorite"),
      "any.required": requiredField("favorite"),
    }),
});

export const signupUserSchema = Joi.object({
  password: Joi.string()
    .required()
    .messages({
      "string.base": wrongType("password", "string"),
      "string.empty": emptyField("password"),
      "any.required": requiredField("password"),
    }),
  email: Joi.string()
    .required()
    .messages({
      "string.base": wrongType("email", "string"),
      "string.empty": emptyField("email"),
      "any.required": requiredField("email"),
    }),
  subscription: Joi.string()
    .valid(...SUBSCRIPTION_TYPES)
    .messages({
      "any.only": `'subscription' has to be one of following: ${SUBSCRIPTION_TYPES.join(
        ", "
      )}!`,
    }),
});

export const signinUserSchema = Joi.object({
  password: Joi.string()
    .required()
    .messages({
      "string.base": wrongType("password", "string"),
      "string.empty": emptyField("password"),
      "any.required": requiredField("password"),
    }),
  email: Joi.string()
    .required()
    .messages({
      "string.base": wrongType("email", "string"),
      "string.empty": emptyField("email"),
      "any.required": requiredField("email"),
    }),
});
