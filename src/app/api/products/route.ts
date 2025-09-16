import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ProductModel } from "@/models/productModel";
import { ProductSchema } from "@/schemas/productsSchema";

// Helper function to generate slug
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    // Validate required basic info
    if (!body.basicInfo?.name) {
      return NextResponse.json(
        { success: false, error: "Product name is required" },
        { status: 400 }
      );
    }

    // Check for existing slug
    if (body.basicInfo?.slug) {
      const existingProduct = await ProductModel.findOne({
        "basicInfo.slug": body.basicInfo.slug,
      });
      if (existingProduct) {
        return NextResponse.json(
          {
            success: false,
            error: "Slug already exists",
            existingProduct: {
              id: existingProduct._id,
              name: existingProduct.basicInfo.name,
            },
          },
          { status: 400 }
        );
      }
    }

    // Build product data section-wise
    const productData = {
      basicInfo: {
        name: body.basicInfo.name, // Required field
        slug: body.basicInfo?.slug || generateSlug(body.basicInfo.name),
        brand: body.basicInfo?.brand || "",
        description: body.basicInfo?.description || "",
        shortDescription: body.basicInfo?.shortDescription || "",
      },
      pricing: {
        price: body.pricing?.price || 10, // Required in schema but default for initial creation
        oldPrice: body.pricing?.oldPrice || undefined,
        discountPercentage: body.pricing?.discountPercentage || undefined,
        taxIncluded: body.pricing?.taxIncluded || false,
        costPrice: body.pricing?.costPrice || undefined,
        hasDiscount: false, // Calculated field
      },
    };

    // Validate against Zod schema
    const validation = ProductSchema.safeParse(productData);
    if (!validation.success) {
      const errors = validation.error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 400 }
      );
    }

    // Create the product
    const product = await ProductModel.create(productData);

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle Mongoose errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Slug must be unique" },
        { status: 400 }
      );
    }

    console.error("Product creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}


