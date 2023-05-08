import express from "express";
import controlUser from "../controller/users.js";
import { auth } from "../controller/middlewares.js";

export const router = express.Router();

router.post("/signup", controlUser.signup);

router.post("/login", controlUser.signin);

router.get("/logout", auth, controlUser.signout);

router.get("/current", auth, controlUser.getCurrentUser);
