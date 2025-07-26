import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const userFormSchema = z.object({
  username: usernameValidation,
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  banner: z.string().optional(),
  image: z.string().optional(),
  isAdmin: z.boolean().default(false).optional(),
  isVerified: z.boolean().default(false).optional(),

  role: z.enum(["admin", "user"]).default("user").optional(),
});

export type IUserFormValue = z.infer<typeof userFormSchema>;
export type IUser = z.infer<typeof userFormSchema> & {
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
};
