import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VisitorModel from "@/models/visitorModel";

export type VisitorPaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "lastVisit"; // Add other sortable fields as needed
  sortOrder?: "asc" | "desc";
};
export async function POST(request: Request) {
  await dbConnect();

  try {
    const requestBody = await request.json();
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = requestBody as VisitorPaginationParams;

    // Build sort option
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortOption: Record<string, 1 | -1> = {
      [sortBy]: sortDirection,
    };

    // Execute queries in parallel
    const [visitors, total] = await Promise.all([
      VisitorModel.find({})
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      VisitorModel.countDocuments({}),
    ]);

    // Transform visitors to only include required fields
    const filteredVisitors = visitors.map((visitor) => ({
      _id: visitor._id,
      visitorId: visitor.visitorId,
      device: visitor.device?.os?.name,
      isBot: visitor.device?.isBot,
      deviceType: visitor.device?.type,
      sessionDuration: calculateDuration(
        new Date(visitor.firstVisit),
        new Date(visitor.lastVisit)
      ),
      location: visitor.location,
      pagesLength: visitor.sessions?.[0]?.pages?.length || 0,
      visitCount: visitor.visitCount,
    }));

    return NextResponse.json({
      success: true,
      data: filteredVisitors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Failed to fetch visitors",
      },
      { status: 500 }
    );
  }
}



// Helper function to calculate duration in minutes:seconds
function calculateDuration(start: Date, end: Date): string {
  const diff = end.getTime() - start.getTime();
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}


export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    // Handle both single ID and array of IDs
    const visitorIds = Array.isArray(body.visitorIds)
      ? body.visitorIds
      : body.visitorId
        ? [body.visitorId]
        : null;

    // Validation
    if (!visitorIds || visitorIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Visitor ID or array of IDs is required" },
        { status: 400 }
      );
    }

    if (visitorIds.some((id: string) => typeof id !== "string")) {
      return NextResponse.json(
        { success: false, error: "All contact IDs must be strings" },
        { status: 400 }
      );
    }

    // Perform deletion
    const deleteResult = await VisitorModel.deleteMany({
      _id: { $in: visitorIds },
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "No visitors found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          deleteResult.deletedCount === 1
            ? "Visitor deleted successfully"
            : `${deleteResult.deletedCount} visitors deleted successfully`,
        data: deleteResult,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}