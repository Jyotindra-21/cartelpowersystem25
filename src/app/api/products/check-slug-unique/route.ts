import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { NextResponse } from "next/server";
import { ProductModel } from "@/models/productModel";
import { SlugParamsSchema } from "@/schemas/productsSchema";

const SlugQuerySchema = z.object({
  slug: SlugParamsSchema,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      slug: searchParams.get("slug"),
    };

    // Validate input
    const result = SlugQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const slugErrors = result.error.format().slug?._errors || [];
      return NextResponse.json(
        {
          success: false,
          error:
            slugErrors.length > 0
              ? slugErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { slug } = result.data;

    // Check slug uniqueness in basicInfo.slug
    const existingProduct = await ProductModel.findOne({
      "basicInfo.slug": slug,
    }).select("_id basicInfo.name"); // Only fetch minimal needed data

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug is already in use",
          data: {
            existingProduct: {
              id: existingProduct._id,
              name: existingProduct.basicInfo.name,
            },
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        error: "Slug is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while checking slug",
      },
      { status: 500 }
    );
  }
}

