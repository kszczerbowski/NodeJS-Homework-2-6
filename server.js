import { app } from "./app.js";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";

app.use(cors());
dotenv.config();

const { MONGODB_URI } = process.env;
const PORT = 3000;

const connection = mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

process.on("SIGINT", () => {
  mongoose.disconnect();
  console.log("Database disconnected!");
});

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Server not running. Error message: ${error.message}`);
    process.exit(1);
  });
