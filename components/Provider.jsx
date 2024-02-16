"use client";

import { SessionProvider } from "next-auth/react";
import Nav from "./Nav";

const Provider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <Nav />
      {children}
    </SessionProvider>
  );
};

export default Provider;
