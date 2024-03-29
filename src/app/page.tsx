import React from "react";
import Feed from "./../components/Feed";
import HomePage from "@src/components/HomePage";
import NavBar from "@src/components/NavBar";

const Home = () => {
  return (
    <div className="relative">
      <div className="fixed left-0 right-0 top-0 z-50">
        {/* <NavBar /> */}
      </div>
      <div className="">
        <HomePage />
      </div>
    </div>
  );
};

export default Home;
