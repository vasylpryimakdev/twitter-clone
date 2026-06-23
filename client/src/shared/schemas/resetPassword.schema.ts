import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
