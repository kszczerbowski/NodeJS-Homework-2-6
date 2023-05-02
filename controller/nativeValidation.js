const _ = require("lodash");
const service = require("../service/index.js");

const ACCEPTED_BODY_PROPERTIES = {
  name: "string",
  email: "string",
  phone: "string",
  favorite: "boolean",
};

const POST_REQUIRED_PROPERTIES = ["name"];
const UPDATE_FAVORITE_REQUIRED_PROPERTIES = ["favorite"];

const REQUEST_TYPES_FOR_BODY_VALIDATION = {
  POST: "post",
  UPDATE: "update",
};

const validateId = async (idToValidate) => {
  const correctIdsObjects = await service.getAllIds();
  const correctIds = correctIdsObjects.map((object) => object.toString());
  const isIdCorrect = !!correctIds.filter(
    (correctId) => correctId === idToValidate
  ).length;
  return isIdCorrect;
};

const validateBody = (body, requestType) => {
  if (_.isEmpty(body)) return "No body passed!";
  if (!Object.values(REQUEST_TYPES_FOR_BODY_VALIDATION).includes(requestType)) {
    console.error(
      `Invalid requestType: ${requestType}. requestType needs to be one of following: ${Object.values(
        REQUEST_TYPES_FOR_BODY_VALIDATION
      ).join(", ")}.`
    );
    return;
  }

  const incorrectPropertyNames = [];
  const propertiesWithIncorrectTypes = [];
  let lackingRequiredProperties = [];

  const keysFromBody = Object.keys(body);
  const correctKeys = Object.keys(ACCEPTED_BODY_PROPERTIES);

  if (requestType === "post") {
    lackingRequiredProperties = POST_REQUIRED_PROPERTIES.filter(
      (requiredProperty) => !keysFromBody.includes(requiredProperty)
    );
  }

  keysFromBody.forEach((key) => {
    if (!correctKeys.includes(key)) {
      incorrectPropertyNames.push(key);
    } else {
      if (!(typeof body[key] === ACCEPTED_BODY_PROPERTIES[key]))
        propertiesWithIncorrectTypes.push(key);
    }
  });

  if (
    incorrectPropertyNames.length === 0 &&
    propertiesWithIncorrectTypes.length === 0
  ) {
    const isBodyCorrect = true;
    return isBodyCorrect;
  } else {
    const lackingRequiredPropertiesMessage = `Lacking required properties: ${lackingRequiredProperties.join(
      ", "
    )}.`;
    const incorrectNamesMessage = `Incorrect property names: ${incorrectPropertyNames.join(
      ", "
    )}.`;
    const incorrectTypesMessage = `Properties with incorrect types: ${propertiesWithIncorrectTypes.join(
      ", "
    )}.`;

    const errorMessageArray = [];

    if (lackingRequiredProperties.length > 0)
      errorMessageArray.push(lackingRequiredPropertiesMessage);
    if (incorrectPropertyNames.length > 0)
      errorMessageArray.push(incorrectNamesMessage);
    if (propertiesWithIncorrectTypes.length > 0)
      errorMessageArray.push(incorrectTypesMessage);

    const errorMessage = errorMessageArray.join(" ");
    return errorMessage;
  }
};

const validateBodyForFavoriteUpdate = (body) => {
  if (_.isEmpty(body)) return "No body passed!";
  const keysFromBody = Object.keys(body);

  const lackingRequiredProperties = UPDATE_FAVORITE_REQUIRED_PROPERTIES.filter(
    (requiredProperty) => !keysFromBody.includes(requiredProperty)
  );
  if (lackingRequiredProperties.length > 0)
    return `Missing fields: ${lackingRequiredProperties.join(", ")}.`;
  return "body correct";
};

module.exports = {
  validateId,
};
