import { ParamType } from "@src/app/api/_lib/type";
import Prompt from "@src/models/prompt";
import { connectToDB } from "@src/utils/database";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest, { params }: ParamType) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({ creator: params.id }).populate(
      "creator",
    );

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts created by user", {
      status: 500,
    });
  }
};
