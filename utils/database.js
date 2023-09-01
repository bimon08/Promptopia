import mongoose from "mongoose";

let isConnected = false; // Uncommented this line to declare isConnected

export const connectToDB = async () => {
  console.log("Connecting to the database...");
  console.log("MongoDB URI:", process.env.MONGODB_URI);
  mongoose.set("strictQuery", true);

  if (isConnected) {
    // Changed the condition to check if isConnected is true
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompt",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
