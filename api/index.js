import express from 'express';
import controlContact from '../controller/index.js';

export const router = express.Router();

router.post("/", controlContact.add);

router.get("/", controlContact.get);

router.get("/:id", controlContact.getById);

router.delete("/:id", controlContact.removeById);

router.put("/:id", controlContact.updateContact);

router.patch("/:id/favorite", controlContact.updateContactFavoriteValue);
