import { z } from "zod";
export const PromptSchema = z.object({
  prompt: z
    .string({
      required_error: "Prompt is required",
    })
    .min(3, {
      message: "Prompt must be at least 3 characters long",
    })
    .max(500, {
      message: "Prompt must be at most 500 characters long",
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
  image_url: z.string().optional(),
});
export type PromptSchemaType = z.infer<typeof PromptSchema>;
