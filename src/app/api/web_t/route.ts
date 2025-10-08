import { trackVisitor } from "@/middleware/track";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
  const userAgent = req.headers.get("user-agent") || "";
  const referrer = req.headers.get("referrer") || "";
  const url = req.headers.get("referer") || "";
  const cookies = req.cookies;
  const path = url.slice(req.nextUrl.origin.length);

  const isValidIP =
    ["127.0.0.1", "::1", "localhost"].includes(ip) ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.");
  if (isValidIP) return NextResponse.json({ success: false });

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

  // ✅ Persist visitorId if not already set
  if (!cookies.get("visitorId")?.value) {
    response.cookies.set("visitorId", result.visitorId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      httpOnly: true,
    });
  }

  response.cookies.set("sessionId", result.sessionId, {
    maxAge: 60 * 30, // 30 minutes
    path: "/",
    httpOnly: true,
  });

  response.cookies.set("lastActivity", new Date().toISOString(), {
    maxAge: 60 * 30,
    path: "/",
    httpOnly: true,
  });

  return response;
}
