const express = require("express");
const logger = require("morgan");

const contactsRouter = require("./api/index.js");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.get("/", (_, res) => {
  res.send("Welcome to my app");
});

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
