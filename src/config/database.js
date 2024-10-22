import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URL;
  await mongoose.connect(mongoURI);
};
