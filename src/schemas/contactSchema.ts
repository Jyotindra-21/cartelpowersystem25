// src/schemas/contact-form.ts
import { z } from "zod";

export const contactFormSchema = z.object({
  _id: z.string().optional(),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: z.string().email("Please enter a valid email address"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only numbers"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
  status: z.enum(["new", "inprogress", "resolved"]).optional(),
});

export const ContactFormCreateSchema = contactFormSchema.omit({
  _id: true,
});

export type IContactForm = z.infer<typeof contactFormSchema>;
export type IContactFormCreateSchema = z.infer<typeof ContactFormCreateSchema>;
