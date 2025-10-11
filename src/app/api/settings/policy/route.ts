import dbConnect from "@/lib/dbConnect";
import { SettingsModel } from "@/models/SettingModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const settings = await SettingsModel.findOne().select("policySection");

    if (!settings || !settings?.policySection) {
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
        data: settings?.policySection,
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
    const policySection = await request.json();

    const updated = await SettingsModel.findOneAndUpdate(
      {},
      { policySection },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, data: updated.policySection },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update our story section" },
      { status: 500 }
    );
  }
}
