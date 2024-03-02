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
  console.log("Request body:", reqBody); // Log the request body

  try {
    const isValid = await PromptSchema.safeParseAsync(reqBody);
    console.log("Validation result:", isValid); // Log the validation result

    if (!isValid.success) {
      console.log("Validation failed. Errors:", isValid.error.issues); // Log validation errors
      return new Response(JSON.stringify(isValid.error.issues), {
        status: 400,
      });
    }

    const { prompt, tag, image_url } = isValid.data;
    console.log("Parsed data:", { prompt, tag, image_url }); // Log the parsed data

    const existingPrompt = await prisma.prompts.findUnique({
      where: {
        id: params.id,
      },
    });

    console.log("Existing prompt:", existingPrompt); // Log the existing prompt

    if (!existingPrompt) {
      console.log("Prompt not found.");
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

    console.log("Updated prompt:", updatedPrompt); // Log the updated prompt

    if (!updatedPrompt) {
      console.log("Error updating prompt.");
      return new Response("Error updating prompt", { status: 500 });
    }

    console.log("Prompt updated successfully.");
    return new Response(
      JSON.stringify({ message: "Prompt updated successfully" }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error occurred while updating Prompt", error);
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
