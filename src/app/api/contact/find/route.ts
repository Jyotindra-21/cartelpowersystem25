import dbConnect from "@/lib/dbConnect";
import { ContactFormModel } from "@/models/contactModel";
import { NextResponse } from "next/server";

type ContactFilterParams = {
  status?: "new" | "inprogress" | "resolved";
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "status";
  sortOrder?: "asc" | "desc";
};

export async function POST(request: Request) {
  await dbConnect();

  try {
    const requestBody = await request.json();
    const {
      status,
      searchQuery,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = requestBody as ContactFilterParams;

    // Build query
    const query: any = {};
    if (status) query.status = status;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search query
    if (searchQuery) {
      query.$or = [
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { message: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Properly typed sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortOption: Record<string, 1 | -1> = {
      [sortBy]: sortDirection,
    };

    // Execute queries
    const [contacts, total] = await Promise.all([
      ContactFormModel.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContactFormModel.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: contacts,
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
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
