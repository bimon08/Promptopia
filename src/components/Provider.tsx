
"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { ISession } from "../../types/Type";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import NavbarContentDemo from "./NavBar";
import { TracingBeamDemo } from "./TracingBeamDemo";

interface ProviderPropsType {
  children: ReactNode;
  session?: ISession;
}

const Provider = ({ children, session }: ProviderPropsType) => {
  return (
    <SessionProvider session={session}>
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
      (status === "unauthenticated" && pathName === "/create-message") ||
      pathName === "/update-message"
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
    (status === "unauthenticated" && pathName === "/create-message") ||
    pathName === "/update-message"
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
