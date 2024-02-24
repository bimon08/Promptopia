import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@src/models/user"; // Import User model with type
import { connectToDB } from "@src/utils/database";
import { prisma } from "prisma/client-prisma";
import { JWT, JWTOptions } from "next-auth/jwt";

type UserDocument = {
  id?: string;
  name: string;
  email: string;
  image: string;
};

interface Session {
  user: UserDocument; // Define type for session's user property
  expires: string;
}

const handler = NextAuth({
  // Apply type to NextAuth handler
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // fix this line below
    // @ts-ignore
    async session({ session, user }): Promise<Session | undefined | null> {
      try {
        if (!session) {
          return null;
        }
        const isConnect = await prisma
          .$connect()
          .then(() => true)
          .catch(() => false);
        if (!isConnect) {
          console.log("Error connecting to database.");
          return null;
        }

        const user = await prisma.users.findUnique({
          where: {
            email: session?.user?.email as string,
          },
        });

        if (!user) {
          return null;
        }
        if (user) {
          const NewSession = {
            user: {
              id: user.id,
              name: user.username,
              email: user.email,
              image: user.image,
            },
            expires: session.expires,
          };

          return NewSession;
        }
      } catch (error) {
        console.error("Error retrieving user from database:", error);
        return null; // Return null on error
      }
    },

    async signIn({ account, profile, user, credentials }): Promise<boolean> {
      try {
        if (!profile) {
          return false;
        }
        await prisma
          .$connect()
          .then(() => console.log("Connected to database"))
          .catch(() => console.log("Error connecting to database"));

        const userExists = await prisma.users.findUnique({
          where: {
            email: profile.email,
          },
        });
        // const userExists = await User.findOne({ email: profile.email });
        if (!userExists) {
          await prisma.users
            .create({
              data: {
                email: profile.email as string,
                username: profile.name as string,
                image: user.image ?? "",
              },
            })
            .then(() => true);
        }

        return true;
      } catch (error) {
        console.error("Error checking or creating user:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
