import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDb connected: ${conn.connection.host}`);
  } catch (e) {
    console.log(e);
  }
};

export default connectDb;
