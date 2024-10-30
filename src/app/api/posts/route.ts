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
    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return new Response(JSON.stringify({
      error: "Unable to retrieve posts at this time",
      message: "We apologize for the inconvenience. Please try again later."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const validatedData = PostSchema.safeParse(requestBody);
    
    if (!validatedData.success) {
      return new Response(JSON.stringify({
        error: "Invalid post data",
        details: validatedData.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
    
    return new Response(JSON.stringify({
      message: "Post created successfully",
      post: newPost
    }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({
        error: "Invalid data format",
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    console.error("Error creating new post:", error instanceof Error ? error.message : "Unknown error");
    
    return new Response(JSON.stringify({
      error: "Unable to create post",
      message: "We encountered an issue while creating your post. Please try again later."
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}