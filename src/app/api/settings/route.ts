import dbConnect from "@/lib/dbConnect";
import { SettingsModel } from "@/models/SettingModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const requestBody = await request.json();
    const { operation, filters, pagination } = requestBody;

    // CREATE operation
    if (operation === "create") {
      if (!requestBody.websiteInfo || !requestBody.heroSection) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        );
      }

      const newSettings = await SettingsModel.create(requestBody);
      return NextResponse.json(
        { success: true, data: newSettings },
        { status: 201 }
      );
    } else if (operation === "update") {
      if (!requestBody._id) {
        return NextResponse.json(
          { success: false, error: "Missing document ID for update" },
          { status: 400 }
        );
      }

      try {

        const updatedSettings = await SettingsModel.findByIdAndUpdate(
          requestBody._id,
          requestBody,
          { new: true, runValidators: true }
        );

        if (!updatedSettings) {
          return NextResponse.json(
            { success: false, error: "Document not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(
          { success: true, data: updatedSettings },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: "Update failed",
            details: (error as Error).message,
          },
          { status: 500 }
        );
      }
    }

    // FETCH operation (with filters/pagination)
    if (operation === "fetch") {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;
      const sortBy = pagination?.sortBy || "createdAt";
      const sortOrder = pagination?.sortOrder || "desc";

      const query: any = {};

      // Apply filters
      if (filters?.searchQuery) {
        const searchRegex = new RegExp(filters.searchQuery, "i");

        const orConditions: Array<{
          [key: string]: RegExp | string | mongoose.Types.ObjectId;
        }> = [
          // Website Info
          { "websiteInfo.metaTitle": searchRegex },
          { "websiteInfo.tagLine": searchRegex },
          { "websiteInfo.metaDescription": searchRegex },
          { "websiteInfo.metaData": searchRegex },
          { "websiteInfo.metaTags": searchRegex },

          // Hero Section
          { "heroSection.head": searchRegex },
          { "heroSection.title": searchRegex },
          { "heroSection.description": searchRegex },
          { "heroSection.floatingFeature.label": searchRegex },
          { "heroSection.features.label": searchRegex },

          // Our Story Section
          { "ourStorySection.titleDesc": searchRegex },
          { "ourStorySection.description": searchRegex },
          { "ourStorySection.storyTeller": searchRegex },
          { "ourStorySection.position": searchRegex },
          { "ourStorySection.quote": searchRegex },
          { "ourStorySection.missionDescription": searchRegex },
          { "ourStorySection.companyStats.label": searchRegex },
          { "ourStorySection.companyStats.value": searchRegex },

          // We Work Across
          { "weWorkAcross.workAcross": searchRegex },
          { "weWorkAcross.workAcrossCities.cityName": searchRegex },

          // Footer Section
          { "footerSection.quickLinks.title": searchRegex },
          { "footerSection.quickLinks.link": searchRegex },
          { "footerSection.technology.title": searchRegex },
          { "footerSection.contactDetails.address": searchRegex },
          { "footerSection.contactDetails.phone": searchRegex },
          { "footerSection.contactDetails.email": searchRegex },
          { "footerSection.whyContactUs.label": searchRegex },
        ];

        // Only add ID search if it's a valid ObjectID string
        if (mongoose.Types.ObjectId.isValid(filters.searchQuery)) {
          orConditions.push({
            _id: new mongoose.Types.ObjectId(filters.searchQuery),
          });
        }
        query.$or = orConditions;
      }

      const [settings, total] = await Promise.all([
        SettingsModel.find(query)
          .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        SettingsModel.countDocuments(query),
      ]);
      return NextResponse.json({
        success: true,
        data: settings?.[0],
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

    return NextResponse.json(
      { success: false, error: "Invalid operation" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
