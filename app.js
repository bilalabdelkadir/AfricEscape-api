import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoute from "./routes/AuthRoute.js";
import destinationRoute from "./routes/DestinationRoute.js";
import reviewRoute from "./routes/ReviewRoute.js";
import bookingRoute from "./routes/BookRoute.js";
import userRoute from "./routes/UserRoute.js";
import connectDatabase from "./config/database.js";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: "./config/dev.env" });
} else if (process.env.NODE_ENV === "staging") {
  dotenv.config({ path: "./config/staging.env" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "./config/prod.env" });
}

connectDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send({ message: "hello there" });
});

app.use("/api/v1", authRoute);
app.use("/api/v1", destinationRoute);
app.use("/api/v1", reviewRoute);
app.use("/api/v1", bookingRoute);
app.use("/api/v1", userRoute);

const server = app.listen(port, () =>
  console.log(`server started at port ${port} in ${process.env.NODE_ENV}`)
);
