"use client";

import { SessionProvider } from "next-auth/react";
import Nav from "./Nav";
import { ReactNode } from "react";
import { SessionType } from "./Type";

interface ProviderPropsType {
  children: ReactNode;
  session?: SessionType; 
}

const Provider = ({ children, session }: ProviderPropsType) => {
  return (
    <SessionProvider session={session}>
      <Nav />
      {children}
    </SessionProvider>
  );
};

export default Provider;
