import mongoose from "mongoose";

const ConnectDatabase = async () => {
  try {
    const data = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB connected: ${data.connection.host}`);
  } catch (error) {
    // A DB we can't reach is fatal — don't limp along serving 500s.
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default ConnectDatabase;
