import { convertSvgToPathArray } from "@/lib/svg-converter";
import { svgLogoSchema } from "@/schemas/logoSchema";
import { z } from "zod";

// Type for our logo data
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
export type LogoData = z.infer<typeof svgLogoSchema>;

// Fetch the active logo
export async function getActiveSvgLogo(): Promise<LogoData | null> {
  try {
    const response = await fetch(`${baseUrl}/api/svglogo`);
    if (!response.ok) throw new Error("Failed to fetch logo");
    return await response.json();
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
}

// Create or update logo
export async function saveSvgLogo(data: LogoData): Promise<LogoData | null> {
  try {
    const response = await fetch("/api/svglogo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving logo:", error);
    return null;
  }
}

type SvgPath = {
  d: string;
  fill?: string;
  stroke?: string;
  className?: string;
  fillRule?: string;
  clipRule?: string;
};
type SvgConversionResult = {
  viewBox: string;
  paths: SvgPath[];
};

export async function convertSvgToPaths(
  svgCode: string
): Promise<SvgConversionResult | null> {
  try {
    const result = convertSvgToPathArray(svgCode);
    return {
      viewBox: result.viewBox,
      paths: result.paths,
    };
  } catch (error) {
    console.error("Error converting SVG:", error);
    return null;
  }
}
