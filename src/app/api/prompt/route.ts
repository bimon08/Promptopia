import Prompt from "@src/models/prompt";
import { connectToDB } from "@src/utils/database";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({}).populate("creator");
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts", { status: 500 });
  }
};
