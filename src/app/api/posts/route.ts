import { NextRequest } from "next/server";
import { prisma } from "prisma/client-prisma";
import { PostSchema } from "@src/models/post";
import { ZodError } from "zod";

export const GET = async (request: NextRequest) => {
  try {
    const messages = await prisma.post.findMany({
      include: {
        user: true,
      },
    });
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch messages ", { status: 500 });
  }
};

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const validatedData = PostSchema.safeParse(requestBody);
    if (!validatedData.success) {
      return new Response(
        JSON.stringify({ errors: validatedData.error.issues }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    const { creator, message, tag, imageUrl, audioUrl } = validatedData.data;
    const newPost = await prisma.post.create({
      data: {
        message,
        tag,
        imageUrl,
        audioUrl,
        user: {
          connect: {
            id: creator,
          },
        },
      },
    });
    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error.issues), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (error instanceof Error) {
      console.error("Failed to create a new post:", error.message);
    } else {
      console.error("An unknown error occurred while creating a new post");
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
