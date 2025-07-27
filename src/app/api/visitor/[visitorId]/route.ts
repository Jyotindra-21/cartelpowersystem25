import dbConnect from "@/lib/dbConnect";
import VisitorModel from "@/models/visitorModel";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ visitorId: string }> }
) {
  await dbConnect();
  try {
    const { visitorId } = await params;
    // Find user by ID and exclude sensitive fields
    const visitor = await VisitorModel.findById(visitorId).select("-__v");
    if (!visitor) {
      return NextResponse.json({ error: "visitor not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch visitor" },
      { status: 500 }
    );
  }
}
