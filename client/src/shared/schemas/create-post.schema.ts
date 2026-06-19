import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Max 120 characters"),

  text: z.string().min(1, "Text is required").max(5000, "Max 5000 characters"),

  imageUrl: z.string().url("Must be valid URL").optional().or(z.literal("")),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
