import dbConnect from "@/lib/dbConnect";
import { SettingsModel } from "@/models/SettingModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const settings = await SettingsModel.findOne().select("footerSection");
    if (!settings || !settings.footerSection) {
      return NextResponse.json(
        {
          success: false,
          error: "Footer not found",
          data: null,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: settings.footerSection,
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const footerSection = await request.json();

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
