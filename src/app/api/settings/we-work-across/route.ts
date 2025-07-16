import dbConnect from "@/lib/dbConnect";
import { SettingsModel } from "@/models/SettingModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const settings = await SettingsModel.findOne().select('weWorkAcross');
    return NextResponse.json(settings?.weWorkAcross || {});
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch we work across section" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const weWorkAcross  = await request.json();
    
    const updated = await SettingsModel.findOneAndUpdate(
      {},
      { weWorkAcross },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json(
      { success: true, data: updated.weWorkAcross },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update we work across section" },
      { status: 500 }
    );
  }
}