import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email"),

  password: z.string().min(6, "Min 6 characters"),

  name: z.string().min(2, "First name too short"),

  surname: z.string().min(2, "Last name too short"),

  username: z
    .string()
    .min(3, "Min 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, _"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
