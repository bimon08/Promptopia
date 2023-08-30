import Feed from "@components/Feed";

const Home = () => {
  return (
    <section className="flex-center w-full flex-col">
      <h1 className="head_text text-center">
        Discover & share
        {/* from max-md:hidden into md */}
        <br className="md" />
        <span className="orange_gradient text-center">AI powered Prompts</span>
      </h1>
      <p className=" desc text-center">
        Welcome to our platform where you can explore AI-powered code snippets
        contributed by developers worldwide. place.
      </p>

      <Feed />
    </section>
  );
};

export default Home;
