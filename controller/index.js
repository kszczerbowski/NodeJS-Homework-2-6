const service = require("../service/index.js");
const validation = require("./validation.js");

const add = async (req, res, next) => {
  const newContactValues = req.body;
  const bodyValidationResult = validation.validateBody(
    newContactValues,
    "post"
  );

  if (bodyValidationResult !== true)
    return res.json({
      status: "failure",
      code: 400,
      message: bodyValidationResult,
    });

  try {
    const newContact = await service.addContact(newContactValues);
    return res.json({
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
    return res.json({
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
  const isIdCorrect = await validation.validateId(id);
  if (!isIdCorrect)
    return res.json({
      status: "failure",
      code: 400,
      message: `There's no ID ${id} in the database!`,
    });
  try {
    const foundContact = await service.getContactById(id);
    console.log({ foundContact });
    return res.json({
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
  const isIdCorrect = await validation.validateId(id);
  if (!isIdCorrect)
    return res.json({
      status: "failure",
      code: 400,
      message: `There's no ID ${id} in the database!`,
    });
  try {
    const removedContact = await service.removeContact(id);
    return res.json({
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
  const isIdCorrect = await validation.validateId(id);
  if (!isIdCorrect)
    return res.json({
      status: "failure",
      code: 400,
      message: `There's no ID ${id} in the database!`,
    });

  const bodyValidationResult = validation.validateBody(req.body, "update");

  if (bodyValidationResult !== true)
    return res.json({
      status: "failure",
      code: 400,
      message: bodyValidationResult,
    });

  try {
    const updatedContactValues = req.body;
    const updatedContact = await service.updateContact(
      id,
      updatedContactValues
    );
    return res.json({
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
  const isIdCorrect = await validation.validateId(id);
  if (!isIdCorrect)
    return res.json({
      status: "failure",
      code: 400,
      message: `There's no ID ${id} in the database!`,
    });

  const bodyValidationResult = validation.validateBodyForFavoriteUpdate(
    req.body
  );
  if (bodyValidationResult !== "body correct")
    return res.json({
      status: "failure",
      code: 400,
      message: bodyValidationResult,
    });
  try {
    const updatedContact = await service.updateContactFavorite(id, req.body);
    return res.json({
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
