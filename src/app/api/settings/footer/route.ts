import dbConnect from "@/lib/dbConnect";
import { SettingsModel } from "@/models/SettingModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const settings = await SettingsModel.findOne().select('footerSection');
    return NextResponse.json(settings?.footerSection || {});
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer section" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const footerSection  = await request.json();
    
    const updated = await SettingsModel.findOneAndUpdate(
      {},
      { footerSection },
      { new: true, upsert: true, runValidators: true }
    );

    
    return NextResponse.json(
      { success: true, data: updated.footerSection },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update footer section" },
      { status: 500 }
    );
  }
}