import { z } from "zod";

export const profileEditSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  surname: z.string().trim().min(1, "Surname is required").optional(),
  username: z
    .string()
    .min(3, "Username too short")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username")
    .transform((val) => val.toLowerCase())
    .optional(),

  avatar: z
    .union([
      z.string().url(),
      z.object({
        url: z.string().url(),
        path: z.string().optional(),
        type: z.enum(["google", "upload"]),
      }),
    ])
    .nullable()
    .optional(),
});

export type ProfileEditForm = z.infer<typeof profileEditSchema>;
