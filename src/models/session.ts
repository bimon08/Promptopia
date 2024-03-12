// src/models/session.ts
import { z } from "zod";
import { UserSchema } from "./user";

export const SessionSchema = z.object({
  user: UserSchema,
  expires: z.string(),
});

export type ISession = z.infer<typeof SessionSchema>;
