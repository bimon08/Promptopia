import { NextRequest } from "next/server";
import { ParamType } from "../../_lib/type";
import { prisma } from "prisma/client-prisma";
import { PromptSchema } from "@src/models/prompt";

export const GET = async (request: NextRequest, { params }: ParamType) => {
  try {
    const prompt = await prisma.prompts.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!prompt) return new Response("Prompt Not Found", { status: 404 });
    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (request: NextRequest, { params }: ParamType) => {
  const reqBody = await request.json();
  try {
    const isValid = await PromptSchema.safeParseAsync(reqBody);

    if (!isValid.success) {
      console.log(isValid);
      return new Response(JSON.stringify(isValid.error.issues), {
        status: 400,
      });
    }
    const { prompt, tag, image_url } = isValid.data;
    // Find the existing prompt by ID
    console.log(image_url);
    const existingPrompt = await prisma.prompts.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    const updatedPrompt = await prisma.prompts.update({
      where: {
        id: params.id,
      },
      data: {
        prompt: prompt,
        tag: tag,
        image_url: image_url,
      },
    });
    if (!updatedPrompt) {
      return new Response("Error updating prompt", { status: 500 });
    }
    return new Response("Successfully updated the Prompts", {
      status: 200,
    });
  } catch (error) {
    return new Response("Error Updating Prompt", { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, { params }: ParamType) => {
  try {
    console.log(params.id);
    // Find the prompt by ID and remove it
    const prompt = await prisma.prompts.delete({
      where: {
        id: params.id,
      },
    });
    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting prompt", { status: 500 });
  }
};
