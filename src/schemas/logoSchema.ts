import { z } from "zod";

export const svgLogoSchema = z.object({
  svg: z.object({
    viewBox: z.string().min(1, "ViewBox is required"),
    size: z.number().positive().optional(),
    paths: z.string().refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return (
            Array.isArray(parsed) &&
            parsed.every((item) => typeof item.d === "string")
          );
        } catch {
          return false;
        }
      },
      {
        message: "Must be a valid JSON array of path objects with 'd' property",
      }
    ),
    animation: z
      .object({
        duration: z.number().positive(),
        delayMultiplier: z.number().nonnegative(),
      })
      .optional(),
    source: z.string().optional(),
  }),
  isActive: z.boolean().default(true).optional(),
});

export type ISvgLogo = z.infer<typeof svgLogoSchema>;
