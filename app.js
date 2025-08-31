import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import taskRoutes from "./routes/task.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.use("/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;