import Prompt from "@src/models/prompt";
import { connectToDB } from "@src/utils/database";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { userId, prompt, tag } = await request.json();

  try {
    await connectToDB();
    const newPrompt = new Prompt({ creator: userId, prompt, tag });

    await newPrompt.save();
    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
