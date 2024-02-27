import React from "react";
import Feed from "./../components/Feed";

const Home = () => {
  // You can replace this with an actual Bible verse
  const bibleVerse =
    "So then let us pursue what makes for peace and for mutual upbuilding.  Romans 14:19";
  return (
    <section className="flex-center w-full flex-col">
      <h1 className="head_text text-center">
        Build and Grow
        <br className="md" />
        <span className="orange_gradient text-center">
          As Iron Sharpens Iron  1
        </span>
      </h1>
      <p className="desc text-center">
        Welcome to our platform where you can build each other up by reading
        {"others'"} posts or creating your own to inspire others.
      </p>
      <p className="desc text-center">{bibleVerse}</p>

      {/* You can replace <Feed /> with a component that displays the shared posts and related content */}
      {/* Example: <SharedPostsFeed /> */}
      <Feed />
    </section>
  );
};

export default Home;
