import mongoose from "mongoose";
import { app } from "./app";

const PORT = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    console.log(process.env);
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    console.log(process.env);
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to auth mongo db");
  } catch (error) {
    console.log(error);
  }

  app.listen(PORT, () => {
    console.log(`Auth server started in port ${PORT}`);
  });
};

start();
