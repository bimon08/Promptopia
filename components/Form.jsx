import Link from "next/link";

import React from "react";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  return (
    <section className="flex-start w-full max-w-full flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc max-w-md text-left">
        {type} and share amazing prompts with the world, and let your
        imagination run with any AI-powered platform
      </p>

      <form
        onSubmit={handleSubmit}
        className="glassmorphism mt-10 flex w-full max-w-2xl flex-col gap-7 "
      >
        <label>
          <span className="font-satoshi text-base font-semibold text-gray-700">
            Your AI Prompt
          </span>

          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder="Write your AI prompt here"
            className="form_textarea"
          />
        </label>
        <label>
          <span className="font-satoshi text-base font-semibold text-gray-700">
            Tag
            <span>(#product, #webdevelopment, #design, etc.)</span>
          </span>

          <inpur
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder="Write your AI prompt here"
            className="form_textarea"
    />
        </label>
      </form>
    </section>
  );
};

export default Form;
