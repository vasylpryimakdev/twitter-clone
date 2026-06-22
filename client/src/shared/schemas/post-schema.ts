import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(120),
  text: z.string().min(1).max(5000),

  image: z
    .union([
      z.instanceof(File),
      z.object({
        url: z.string().url(),
        path: z.string(),
      }),
    ])
    .nullable()
    .optional(),
});

export type PostFormData = z.infer<typeof createPostSchema>;
