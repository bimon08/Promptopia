// types/next-auth.d.ts
import { Session } from "next-auth";

declare module "next-auth" {
  /**
   * This is an example of how you could extend the built-in session type.
   * Here, the `user` property is customized to have an `id` string.
   */
  interface Session {
    user: {
      id: string;
      image: string;
      name?: string | null;
      email?: string | null;
    };
  }
}