import { z } from "zod";

export const profileEditSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  surname: z.string().trim().min(1, "Surname is required"),
  username: z
    .string()
    .min(3, "Username too short")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username")
    .transform((val) => val.toLowerCase()),

  avatar: z
    .object({
      url: z.string().url(),
      path: z.string(),
    })
    .nullable()
    .optional(),
});

export type ProfileEditForm = z.infer<typeof profileEditSchema>;
