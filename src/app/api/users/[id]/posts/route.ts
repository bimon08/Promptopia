import { ParamType } from "@src/app/api/_lib/type";
import Prompt from "@src/models/prompt";
import { connectToDB } from "@src/utils/database";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "prisma/client";

export const GET = async (request: NextRequest, { params }: ParamType) => {
  try {
    // server side validation missing
    const isConnected = prisma
      .$connect()
      .then(() => true)
      .catch(() => false);
    ``;
    await connectToDB();

    if (!isConnected) {
      return NextResponse.json({
        status: 500,
        message: "Failed to connect to database",
      });
    }

    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: params.id,
    //   },
    // });
    // console.log("user");
    // if (user) {
    //   return NextResponse.json({
    //     status: 404,
    //     message: "User not found",
    //   });
    // }

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
