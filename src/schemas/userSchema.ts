import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const userFormSchema = z.object({
  username: usernameValidation,
  email: z.string().email("Please enter a valid email address"),
  isAdmin: z.boolean().default(false).optional(),
  isVerified: z.boolean().default(false).optional(),

  role: z.enum(["admin", "user"]).default("user").optional(),
});

export type IUser = z.infer<typeof userFormSchema> & {
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
};
