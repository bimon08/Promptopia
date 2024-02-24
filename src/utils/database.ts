// import mongoose from "mongoose";

// let isConnected = false; // Uncommented this line to declare isConnected

// export const connectToDB = async () => {
//   console.log("Connecting to the database...");
//   mongoose.set("strictQuery", true);

//   if (!process.env.MONGODB_URI) {
//     throw new Error("MONGODB_URI is not defined in the environment variables.");
//   }

//   if (isConnected) {
//     // Changed the condition to check if isConnected is true
//     console.log("MongoDB is already connected.");
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "TestDBPrompt",
//     });

//     isConnected = true;
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// };
