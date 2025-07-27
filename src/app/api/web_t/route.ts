import { trackVisitor } from "@/middleware/track";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
  const userAgent = req.headers.get("user-agent") || "";
  const referrer = req.headers.get("referrer") || "";
  const url = req.headers.get("referer") || "";
  const cookies = req.cookies;
  const path = url.slice(req.nextUrl.origin.length);

  const result = await trackVisitor({
    ip,
    userAgent,
    referrer,
    url: path,
    cookies: {
      get(name: string) {
        const value = cookies.get(name)?.value;
        return value ? { value } : undefined;
      },
    },
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set("sessionId", result.sessionId, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    httpOnly: true,
  });

  response.cookies.set("lastActivity", new Date().toISOString(), {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    httpOnly: true,
  });

  return response;
}
