import { NextRequest } from "next/server";
import { prisma } from "prisma/client-prisma";
import { delete_image_func } from "@src/utils/delete_image_func";


export async function POST(request: NextRequest) {
  const { userId, message, tag, imageUrl, audioUrl } = await request.json();

  try {
    const newPost = await prisma.post.create({
      data: {
        message,
        tag,
        imageUrl,
        audioUrl,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error: any) {
    console.error("Failed to create a new post:", error);

    // Delete associated files from Firebase if post creation fails
    const deletePromises = [];

    if (imageUrl) {
      const imageFileName = imageUrl.split("/").pop();
      if (imageFileName) {
        deletePromises.push(
          delete_image_func({ fileName: imageFileName, email: userId }),
        );
      }
    }

    if (audioUrl) {
      const audioFileName = audioUrl.split("/").pop();
      if (audioFileName) {
        deletePromises.push(
          delete_image_func({ fileName: audioFileName, email: userId }),
        );
      }
    }

    try {
      await Promise.all(deletePromises);
    } catch (deleteError: any) {
      console.error("Error deleting files from Firebase:", deleteError);
    }

    return new Response("Failed to create a new post", { status: 500 });
  }
}