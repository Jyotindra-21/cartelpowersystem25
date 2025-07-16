import dbConnect from "@/lib/dbConnect";
import { SettingsModel } from "@/models/SettingModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const settings = await SettingsModel.findOne().select("websiteInfo");

    if (!settings || !settings.websiteInfo) {
      return NextResponse.json(
        {
          success: false,
          error: "Website info not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: settings.websiteInfo,
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching website info:", error);
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
    const websiteInfo = await request.json();

    const updated = await SettingsModel.findOneAndUpdate(
      {},
      { websiteInfo },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, data: updated.websiteInfo },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update website info" },
      { status: 500 }
    );
  }
}
