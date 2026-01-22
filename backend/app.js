import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import messageRouter from "./routes/messageRoute.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { isAuthenticated } from "./middlewares/auth.js";

const app = express();
config({ path: "./config/config.env" });

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the API!');  // Root route
});

app.get('/api/v1/auth/me', isAuthenticated, (req, res) => {
  res.json(req.user);
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/message", messageRouter);
dbConnection();

app.use(errorMiddleware);
export default app;
