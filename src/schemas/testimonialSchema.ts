import { z } from "zod";

export const testimonialSchema = z.object({
  _id: z.string().optional(),
  fullName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  designation: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  image: z.string().min(1, "Image is required"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(150, "Description must be less than 150 characters"),
  status: z.boolean().default(true).optional(),
});

export const TestimonialCreateSchema = testimonialSchema.omit({
  _id: true,
});

export type ITestimonial = z.infer<typeof testimonialSchema>;
export type ITestimonialCreateSchema = z.infer<typeof TestimonialCreateSchema>;
