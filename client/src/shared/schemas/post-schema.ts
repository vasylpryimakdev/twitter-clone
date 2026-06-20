import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),

  text: z.string().min(1, "Text is required").max(5000),

  imageUrl: z
    .union([z.instanceof(File), z.string().url(), z.null()])
    .optional(),
});

export type PostFormData = z.infer<typeof createPostSchema>;
