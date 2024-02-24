import { NextRequest } from "next/server";
import { prisma } from "prisma/client-prisma";

export async function POST(request: NextRequest) {
  const { userId, prompt, tag, image_url } = await request.json();
  try {
    const newPrompt = await prisma.prompts.create({
      data: {
        creator: userId,
        prompt: prompt,
        tag: tag,
        image_url: image_url,
      },
    });
    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error: any) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
}
