import { NextRequest } from "next/server";
import { ParamType } from "../../_lib/type";
import { prisma } from "prisma/client-prisma";
import { PostSchema } from "@src/models/post";
import { delete_image_func } from "@src/utils/delete_image_func";

export const GET = async (request: NextRequest, { params }: ParamType) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!post) return new Response("Post Not Found", { status: 404 });
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (request: NextRequest, { params }: ParamType) => {
  const reqBody = await request.json();
  console.log("Request body:", reqBody);

  try {
    const isValid = await PostSchema.safeParseAsync(reqBody);
    console.log("Validation result:", isValid);

    if (!isValid.success) {
      console.log("Validation failed. Errors:", isValid.error.issues);
      return new Response(JSON.stringify(isValid.error.issues), {
        status: 400,
      });
    }

    const { message, tag, imageUrl, audioUrl } = isValid.data;
    console.log("Parsed data:", { message, tag, imageUrl, audioUrl });

    const existingPost = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    console.log("Existing post:", existingPost);

    if (!existingPost) {
      console.log("Post not found.");
      return new Response("Post not found", { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: params.id,
      },
      data: {
        message,
        tag,
        imageUrl,
        audioUrl,
      },
    });

    console.log("Updated post:", updatedPost);

    if (!updatedPost) {
      console.log("Error updating post.");
      return new Response("Error updating post", { status: 500 });
    }

    console.log("Post updated successfully.");
    return new Response(
      JSON.stringify({ message: "Post updated successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error occurred while updating post", error);
    return new Response("Error updating post", { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, { params }: ParamType) => {
  try {
    console.log(params.id);
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    // Delete associated files from Firebase
    if (post.imageUrl) {
      const imageFileName = post.imageUrl.split("/").pop();
      if (imageFileName) {
        await delete_image_func({
          fileName: imageFileName,
          email: post.creator,
        });
      }
    }

    if (post.audioUrl) {
      const audioFileName = post.audioUrl.split("/").pop();
      if (audioFileName) {
        await delete_image_func({
          fileName: audioFileName,
          email: post.creator,
        });
      }
    }

    // Delete the post from the database
    await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    return new Response("Post deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response("Error deleting post", { status: 500 });
  }
};
