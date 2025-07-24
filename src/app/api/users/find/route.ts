import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";

type UserFilterParams = {
  searchQuery?: string;
  role?: "admin" | "user";
  isVerified?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "username" | "email" | "role";
  sortOrder?: "asc" | "desc";
  getAll?: boolean; // New flag to skip pagination
};

export async function POST(request: Request) {
  await dbConnect();

  try {
    const requestBody = await request.json();
    const {
      searchQuery,
      role,
      isVerified,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      getAll = false, // Default to false
    } = requestBody as UserFilterParams;

    // Build query
    const query: any = {};
    
    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (searchQuery) {
      query.$or = [
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortOption: Record<string, 1 | -1> = {
      [sortBy]: sortDirection,
    };

    let users, total;
    
    if (getAll) {
      // Skip pagination when getAll is true
      [users, total] = await Promise.all([
        UserModel.find(query)
          .sort(sortOption)
          .lean(),
        UserModel.countDocuments(query),
      ]);
      
      return NextResponse.json({
        success: true,
        data: users,
        totalCount: total, // Return total count for reference
      });
    } else {
      // Normal paginated response
      [users, total] = await Promise.all([
        UserModel.find(query)
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        UserModel.countDocuments(query),
      ]);

      return NextResponse.json({
        success: true,
        data: users,
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
        error: (error as Error).message || 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}