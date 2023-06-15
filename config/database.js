import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("database conneted", process.env.DB_URL))
    .catch((error) =>
      console.log(`failed to connect [[[[----${error} ----]]]]`)
    );
};

export default connectDatabase;
