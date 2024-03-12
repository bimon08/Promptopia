// src/models/user.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string() ,
  username: z.string(),
  email: z.string().email(),
  image: z.string().url().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type IUser = z.infer<typeof UserSchema>;
