import dbConnect from "@/lib/dbConnect";
import { SettingsModel } from "@/models/SettingModel";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const settings = await SettingsModel.findOne().select("ourStorySection");
    return NextResponse.json(settings?.ourStorySection || {});
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch our story section" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const ourStorySection = await request.json();

    const updated = await SettingsModel.findOneAndUpdate(
      {},
      { ourStorySection },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, data: updated.ourStorySection },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update our story section" },
      { status: 500 }
    );
  }
}
