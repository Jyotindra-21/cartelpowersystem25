import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const userFormSchema = z.object({
  username: usernameValidation,
  email: z.string().email("Please enter a valid email address"),
  isAdmin: z.boolean().default(false),
  isVerified: z.boolean().default(false),

  role: z.enum(["admin", "user"]).default("user"),
});

export type IUser = z.infer<typeof userFormSchema> & {
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
};
