import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { TeamMemberCreateSchema } from "@/schemas/teamMemberSchema";
import TeamMember from "@/models/teamMemberModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = TeamMemberCreateSchema.parse(body);

    // Create the testimonial
    const teamMember = await TeamMember.create(validatedData);

    // Return the created testimonial without unnecessary fields
    const { __v, ...teamMemberData } = teamMember.toObject();

    return NextResponse.json(
      {
        success: true,
        data: teamMemberData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating Team Member:", error);

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors (if you have unique constraints)
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Team Member with similar data already exists",
        },
        { status: 409 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create team member",
      },
      { status: 500 }
    );
  }
}
