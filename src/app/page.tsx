import React from "react";
import Feed from "./../components/Feed";
import { TextGenerateEffect } from "@src/components/ui/text-generate-effect";

const Home = () => {
  const bibleVerse =
    "So then let us pursue what makes for peace and for mutual upbuilding.  Romans 14:19"
  const description ="Welcome to our platform where you can build each other up by readin others posts or creating your own to inspire others."
  return (
    <section className="flex-center w-full flex-col font-inter text-white">
      <h1 className="head_text text-center">
        Build and Grow
        <br className="md" />
        <span className="orange_gradient text-center">
          As Iron Sharpens Iron
        </span>
      </h1>
      <TextGenerateEffect words={description} className="text-center  py-6" />
      <TextGenerateEffect words={bibleVerse} className="text-center " />
      <Feed />
    </section>
  );
};

export default Home;
