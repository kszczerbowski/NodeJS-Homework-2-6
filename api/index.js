const express = require("express");
const router = express.Router();
const controlContact = require("../controller/index.js");

router.post("/", controlContact.add);

router.get("/", controlContact.get);

router.get("/:id", controlContact.getById);

router.delete("/:id", controlContact.removeById);

router.put("/:id", controlContact.updateContact);

router.patch("/:id/favorite", controlContact.updateContactFavoriteValue);

module.exports = router;
