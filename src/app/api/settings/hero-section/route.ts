import dbConnect from "@/lib/dbConnect";
import { SettingsModel } from "@/models/SettingModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const settings = await SettingsModel.findOne().select('heroSection');
    return NextResponse.json(settings?.heroSection || {});
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero section" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {

    const  heroSection = await request.json();    
    const updated = await SettingsModel.findOneAndUpdate(
      {},
      { heroSection },
      { new: true, upsert: true, runValidators: true }
    );

    
    return NextResponse.json(
      { success: true, data: updated.heroSection },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update hero section" },
      { status: 500 }
    );
  }
}