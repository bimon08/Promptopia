"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Nav from "./Nav";
import { ReactNode, useEffect } from "react";
import { SessionType } from "./Type";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

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

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathName = usePathname();
  const { status } = useSession();
  useEffect(() => {
    if (
      (status === "unauthenticated" && pathName === "/create-prompt") ||
      pathName === "/update-prompt"
    ) {
      router.push("/");
    }
  }, [status, router, pathName]);

  if (status === "loading") {
    return (
      <>
        <div>
          <h1>Loading screen</h1>
        </div>
      </>
    );
  }
  if (
    (status === "unauthenticated" && pathName === "/create-prompt") ||
    pathName === "/update-prompt"
  ) {
    return (
      <div>
        <h1>UN Auth</h1>
      </div>
    );
  }
  return (
    <>
      <div>{children}</div>
    </>
  );
};
