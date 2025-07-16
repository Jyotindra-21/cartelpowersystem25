import dbConnect from "@/lib/dbConnect";
import SvgLogoModel from "@/models/LogoSvg";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const logo = await SvgLogoModel.findOne({ isActive: true });

    if (!logo) {
      return NextResponse.json(
        { error: "No active svg logo found" },
        { status: 404 }
      );
    }

    return NextResponse.json(logo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch svg logo" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const existingLogo = await SvgLogoModel.findOne();

    if (existingLogo) {
      const updatedLogo = await SvgLogoModel.findByIdAndUpdate(
        existingLogo._id,
        {
          $set: {
            ...body,
            isActive: true, // Ensure it's set to active
          },
        },
        { new: true } // Return the updated document
      );
      return NextResponse.json(updatedLogo);
    } else {
      const logoOld = await SvgLogoModel.create(body);
      return NextResponse.json(logoOld);
    }
    // Create new active logo with proper structure
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        error: "Failed to create svg logo",
        details: error,
      },
      { status: 500 }
    );
  }
}
