import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRouter from "./routes/authRoute.js";
import destinationRouter from "./routes/DestinationRoutes.js";
import reviewRouter from "./routes/reviewRoute.js";
import bookingRouter from "./routes/bookRoute.js";
import userRouter from "./routes/userRoute.js";

import connectDatabase from "./config/database.js";
dotenv.config({ path: "./config/config.env" });

connectDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// set up routes
app.use("/api/v1", authRouter);
app.use("/api/v1", destinationRouter);
app.use("/api/v1", reviewRouter);
app.use("/api/v1", bookingRouter);
app.use("/api/v1", userRouter);

const server = app.listen(process.env.PORT, () =>
  console.log(
    `server started at port ${process.env.PORT} in ${process.env.NODE_ENV}`
  )
);
