import express from "express";
import controlAvatars from "../controller/avatars.js";

export const router = express.Router();

router.get("/:fileName", controlAvatars.displaySavedImage);
