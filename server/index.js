import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";

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

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

// Run server
const server = app.listen(port, () => {
  console.log(`Server ir running at port ${port}`);
});

// Sockets
setupSocket(server);

mongoose
  .connect(databaseURL)
  .then(() => console.log("DB Connection Successfull."))
  .catch((err) => console.log(err.message));
