// d:/Projects/Promptopia/src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "prisma/client-prisma";

type UserDocument = {
  id?: string;
  name: string;
  email: string;
  image: string;
};

interface Session {
  user: UserDocument;
  expires: string;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }): Promise<Session> {
      try {
        if (!session) {
          return { user: { name: "", email: "", image: "" }, expires: "" };
        }
        const isConnect = await prisma
          .$connect()
          .then(() => true)
          .catch(() => false);
        if (!isConnect) {
          console.log("Error connecting to database.");
          return { user: { name: "", email: "", image: "" }, expires: "" };
        }

        const dbUser = await prisma.user.findUnique({
          where: {
            email: session?.user?.email as string,
          },
        });

        if (!dbUser) {
          return { user: { name: "", email: "", image: "" }, expires: "" };
        }
        const NewSession = {
          user: {
            id: dbUser.id,
            name: dbUser.username,
            email: dbUser.email,
            image: dbUser.image,
          },
          expires: session.expires,
        };

        return NewSession;
      } catch (error) {
        console.error("Error retrieving user from database:", error);
        return { user: { name: "", email: "", image: "" }, expires: "" };
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

        const userExists = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });
        if (!userExists) {
          await prisma.user
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
