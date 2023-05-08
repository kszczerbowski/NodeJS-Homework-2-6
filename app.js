import express from "express";
import logger from "morgan";
import { router as contactsRouter } from "./api/contacts.js";
import { router as usersRouter } from "./api/users.js";

export const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.get("/", (_, res) => {
  res.send("Welcome to my app");
});

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res) => {
  res.status(500).json({ message: err.message });
});
