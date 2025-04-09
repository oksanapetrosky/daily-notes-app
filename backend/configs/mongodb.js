import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ Database Connected");
  });

  await mongoose.connect(`${process.env.MONGODB_URI}/dailynotesapp`);
};

export default connectDB;
