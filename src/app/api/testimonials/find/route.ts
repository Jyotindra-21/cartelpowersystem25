import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/testimonialModel";

type TestimonialFilterParams = {
  searchQuery?: string;
  status?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "fullName";
  sortOrder?: "asc" | "desc";
  getAll?: boolean; // Flag to skip pagination
};

export async function POST(request: Request) {
  await dbConnect();

  try {
    const requestBody = await request.json();
    const {
      searchQuery,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      getAll = false,
    } = requestBody as TestimonialFilterParams;

    // Build query
    const query: any = {};
    
    if (status !== undefined) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (searchQuery) {
      query.$or = [
        { fullName: { $regex: searchQuery, $options: "i" } },
        { designation: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortOption: Record<string, 1 | -1> = {
      [sortBy]: sortDirection,
    };

    let testimonials, total;
    
    if (getAll) {
      // Skip pagination when getAll is true
      [testimonials, total] = await Promise.all([
        Testimonial.find(query)
          .sort(sortOption)
          .lean(),
        Testimonial.countDocuments(query),
      ]);
      
      return NextResponse.json({
        success: true,
        data: testimonials,
        totalCount: total,
      });
    } else {
      // Normal paginated response
      [testimonials, total] = await Promise.all([
        Testimonial.find(query)
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Testimonial.countDocuments(query),
      ]);

      return NextResponse.json({
        success: true,
        data: testimonials,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to fetch testimonials',
      },
      { status: 500 }
    );
  }
}

// GET all testimonials (simple endpoint)
export async function GET() {
  await dbConnect();

  try {
    const testimonials = await Testimonial.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to fetch testimonials',
      },
      { status: 500 }
    );
  }
}