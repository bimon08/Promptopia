import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Callbacks
  callbacks: {
    async session({ session }) {
      // Store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        console.log("Connecting to MongoDB...");
        await connectToDB();

        // Check if the user already exists
        const userExists = await User.findOne({ email: profile.email });

        // If not, create a new document and save the user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
            // Add a default password or omit this field based on your requirements
            // password: "default_password", // Change this to an appropriate default password
          });
        }

        return true;
      } catch (error) {
        console.log(
          "Error checking if user exists or creating user: ",
          error.message,
        );
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
