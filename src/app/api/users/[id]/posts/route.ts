import { ParamType } from "@src/app/api/_lib/type";

import { NextRequest } from "next/server";
import { prisma } from "prisma/client-prisma";

export const GET = async (request: NextRequest, { params }: ParamType) => {
  try {
    const prompts = await prisma.prompts.findMany({
      where: {
        creator: params.id,
      },
      select: {
        id: true,
        prompt: true,
        image_url: true,
        tag: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts created by user", {
      status: 500,
    });
  }
};
