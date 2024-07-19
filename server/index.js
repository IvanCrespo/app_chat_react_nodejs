import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Importar y config. dotenv
dotenv.config();

// Config. Express
const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Run server
const server = app.listen(port, () => {
  console.log(`Server ir running at port ${port}`);
});

mongoose
  .connect(databaseURL)
  .then(() => console.log("DB Connection Successfull."))
  .catch((err) => console.log(err.message));
