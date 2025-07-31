import dbConnect from "@/lib/dbConnect";
import { UAParser } from "ua-parser-js";
import { v4 as uuid } from "uuid";
import VisitorModel from "@/models/visitorModel";

interface TrackVisitorOptions {
  ip: string;
  userAgent: string;
  referrer: string;
  url: string;
  cookies: { get(name: string): { value: string } | undefined };
}

async function fetchGeoLocation(ip: string) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) throw new Error("Geo API failed");
    const data = await res.json();
    return {
      country: data.country_name,
      region: data.region,
      city: data.city,
      timezone: data.timezone,
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (err) {
    console.error("Geo lookup failed:", err);
    return null;
  }
}

export async function trackVisitor({
  ip,
  userAgent,
  referrer,
  url,
  cookies,
}: TrackVisitorOptions) {
  await dbConnect();

  const uaResult = new UAParser(userAgent).getResult();
  const geo = await fetchGeoLocation(ip);

  // ✅ Use cookie-stored visitorId instead of IP-based hash
  let visitorId = cookies.get("visitorId")?.value;
  const isNewVisitor = !visitorId;

  if (!visitorId) {
    visitorId = uuid(); // new visitor
  }

  let sessionId = cookies.get("sessionId")?.value;
  const lastActivity = cookies.get("lastActivity")?.value;
  const isNewSession = !sessionId || isSessionExpired(lastActivity);

  if (!sessionId || isNewSession) {
    sessionId = uuid(); // new session
  }

  const updateData: any = {
    ipAddress: ip,
    userAgent,
    referrer,
    lastVisit: new Date(),
    $inc: { visitCount: 1 },
    $set: {
      "device.type": uaResult.device.type || "desktop",
      "device.browser.name": uaResult.browser.name,
      "device.browser.version": uaResult.browser.version,
      "device.os.name": uaResult.os.name,
      "device.os.version": uaResult.os.version,
      "device.isBot": isBot(userAgent),
    },
  };

  if (geo) {
    updateData.$set.location = {
      country: geo.country,
      region: geo.region,
      city: geo.city,
      timezone: geo.timezone,
      ll: [geo.latitude, geo.longitude],
    };
  }

  const visitor = await VisitorModel.findOne({ visitorId });
  if (!visitor) {
    updateData.$set.firstVisit = new Date();
  }

  const sessionData = {
    sessionId,
    startTime: new Date(),
    pages: [
      {
        url,
        timestamp: new Date(),
        referrer,
      },
    ],
  };

  if (isNewSession || !visitor || !Array.isArray(visitor.sessions)) {
    updateData.$push = {
      sessions: sessionData,
    };
  } else {
    updateData.$push = {
      "sessions.$[session].pages": {
        url,
        timestamp: new Date(),
        referrer,
      },
    };
  }

  await VisitorModel.updateOne({ visitorId }, updateData, {
    upsert: true,
    arrayFilters: isNewSession
      ? undefined
      : [{ "session.sessionId": sessionId }],
  });

  return {
    visitorId,
    sessionId,
    isNewVisitor,
    isNewSession,
  };
}

function isBot(userAgent: string): boolean {
  const botPatterns = [
    "bot",
    "crawl",
    "spider",
    "slurp",
    "search",
    "google",
    "yahoo",
    "bing",
    "duckduck",
    "baidu",
  ];
  return new RegExp(botPatterns.join("|"), "i").test(userAgent);
}

function isSessionExpired(lastActivity?: string): boolean {
  if (!lastActivity) return true;
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  return Date.now() - new Date(lastActivity).getTime() > SESSION_TIMEOUT;
}
