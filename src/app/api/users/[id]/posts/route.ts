import { ParamType } from "@src/app/api/_lib/type";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "prisma/client-prisma";

export const GET = async (request: NextRequest, { params }: ParamType) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        creator: params.id,
      },
      select: {
        id: true,
        message: true,
        imageUrl: true,
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

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch posts created by user", {
      status: 500,
    });
  }
};
