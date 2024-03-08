import { z } from "zod";

export const PostSchema = z.object({
  message: z
    .string({
      required_error: "Post is required",
    })
    .min(3, {
      message: "Post must be at least 3 characters long",
    })
    .max(500, {
      message: "Post must be at most 500 characters long",
    }),

  tag: z
    .string({
      required_error: "Tag is required",
    })
    .min(3, {
      message: "Tag must be at least 3 characters long",
    })
    .max(20, {
      message: "Tag must be at most 20 characters long",
    }),

  imageUrl: z
    .string({
      required_error: "Image URL is required",
    })
    .url({
      message: "Invalid image URL",
    })
    .optional(),

  audioUrl: z
    .string({
      required_error: "Audio URL is required",
    })
    .url({
      message: "Invalid audio URL",
    })
    .optional(),
});

export type PostSchemaType = z.infer<typeof PostSchema>;
