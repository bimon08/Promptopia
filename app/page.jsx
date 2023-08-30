import Feed from "@components/Feed";

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & share
        {/* from md into sm */}
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">AI powered Prompts</span>
      </h1>
      <p className=" text-center desc">
        Welcome to our platform where you can explore AI-powered code snippets
        contributed by developers worldwide. place.
      </p>

      <Feed />
    </section>
  );
};

export default Home;
