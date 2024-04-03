import mongoose from "mongoose";
import Team from "../Models/Team.model.js";

const ConnectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`MongoDB connected : ${connection.connection.host}`);
    // await Team.updateMany({}, { $set: { solvedQuestions: [] } });
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default ConnectDB;
