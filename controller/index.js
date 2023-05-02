const service = require("../service/index.js");
const {
  newContactSchema,
  updatedContactSchema,
  updatedContactSchemaFavorite,
} = require("./joiSchemas.js");
const { validateId } = require("./nativeValidation.js");

const add = async (req, res, next) => {
  const { error, value: newContactValues } = newContactSchema.validate(
    req.body
  );

  if (error !== undefined)
    return res.status(400).json({
      status: "failure",
      code: 400,
      message: "body absent or incorrect",
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
    req.body
  );
  if (error !== undefined)
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
    updatedContactSchemaFavorite.validate(req.body);
  if (error !== undefined)
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

module.exports = {
  add,
  get,
  getById,
  removeById,
  updateContact,
  updateContactFavoriteValue,
};
