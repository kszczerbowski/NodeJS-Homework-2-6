import service from "../service/index.js";
import {
  newContactSchema,
  updatedContactSchema,
  updatedContactSchemaFavorite,
} from "./joiSchemas.js";
import { validateId } from "./nativeValidation.js";

const add = async (req, res, next) => {
  const { error, value: newContactValues } = newContactSchema.validate(
    req.body,
    { abortEarly: false }
  );

  if (error)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: error,
    });

  try {
    const newContact = await service.addContact(newContactValues);
    return res.status(201).json({
      status: "success",
      code: 201,
      data: { newContact },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const contacts = await service.getAllContacts();
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const isIdCorrect = await validateId(id);
  if (!isIdCorrect)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: `There's no ID ${id} in the database!`,
    });

  try {
    const foundContact = await service.getContactById(id);
    console.log({ foundContact });
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { foundContact },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const removeById = async (req, res, next) => {
  const { id } = req.params;
  const isIdCorrect = await validateId(id);
  if (!isIdCorrect)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: `There's no ID ${id} in the database!`,
    });

  try {
    const removedContact = await service.removeContact(id);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { removedContact },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const isIdCorrect = await validateId(id);
  if (!isIdCorrect)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: `There's no ID ${id} in the database!`,
    });

  const { error, value: updatedContactValues } = updatedContactSchema.validate(
    req.body,
    { abortEarly: false }
  );
  if (error)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: "body absent or incorrect",
    });

  try {
    const updatedContact = await service.updateContact(
      id,
      updatedContactValues
    );
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateContactFavoriteValue = async (req, res, next) => {
  const { id } = req.params;
  const isIdCorrect = await validateId(id);
  if (!isIdCorrect)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: `There's no ID ${id} in the database!`,
    });

  const { error, value: newFavoriteSetting } =
    updatedContactSchemaFavorite.validate(req.body, { abortEarly: false });
  if (error)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: "body absent or incorrect",
    });

  try {
    const updatedContact = await service.updateContactFavorite(
      id,
      newFavoriteSetting
    );
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default {
  add,
  get,
  getById,
  removeById,
  updateContact,
  updateContactFavoriteValue,
};
