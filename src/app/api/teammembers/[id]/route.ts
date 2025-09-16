import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TeamMember from "@/models/teamMemberModel";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  await dbConnect();

  try {
    const teamMember = await TeamMember.findById(params.id).lean();

    if (!teamMember) {
      return NextResponse.json(
        {
          success: false,
          error: "TeamMember not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to fetch teamMember',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  await dbConnect();

  try {
    const body = await request.json();
    const teamMember = await TeamMember.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).lean();

    if (!teamMember) {
      return NextResponse.json(
        {
          success: false,
          error: "TeamMember not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to update teamMember',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();

  try {
    const teamMember = await TeamMember.findByIdAndDelete(params.id).lean();

    if (!teamMember) {
      return NextResponse.json(
        {
          success: false,
          error: "TeamMember not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { _id: params.id },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to delete teamMember',
      },
      { status: 500 }
    );
  }
}