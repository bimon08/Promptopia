import { NextRequest } from "next/server";
import { prisma } from "prisma/client-prisma";

export const GET = async (request: NextRequest) => {
  try {
    const messages = await prisma.post.findMany({
      include: {
        user: true,
      },
    });
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch messages ", { status: 500 });
  }
};
