import { NextRequest } from "next/server";
import { prisma } from "prisma/client-prisma";

export const GET = async (request: NextRequest) => {
  try {
    await prisma.$connect().then(() => console.log("Connected to database"));
    const prompts = await prisma.prompts.findMany({
      include: {
        user: true,
      },
    });

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.log(error);

    return new Response("Failed to fetch prompts ", { status: 500 });
  }
};
