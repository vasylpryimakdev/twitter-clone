import { z } from "zod";

export const profileEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  username: z
    .string()
    .min(3, "Username too short")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username"),
});

export type ProfileEditForm = z.infer<typeof profileEditSchema>;
