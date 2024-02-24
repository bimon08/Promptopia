import { z } from "zod";

export const UserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    })
    .trim(),
  username: z.string({
    required_error: "Username is required",
  }),
  image: z.string().optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
