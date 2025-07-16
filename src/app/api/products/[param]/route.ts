
import dbConnect from "@/lib/dbConnect";
import { IProductDocument, ProductModel } from "@/models/productModel";
import { ProductSections } from "@/schemas/productsSchema";
import { NextResponse } from "next/server";

// Helper function to check if param is a valid MongoDB ID
function isMongoId(param: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(param);
}

// GET single product by ID or slug
export async function GET(
  request: Request,
  { params }: { params: { param: string } }
) {
  await dbConnect();

  try {
    let product: IProductDocument | null = null;

    if (isMongoId(params.param)) {
      product = await ProductModel.findById(params.param);
    } else {
      product = await ProductModel.findOne({
        "basicInfo.slug": params.param,
      });
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// UPDATE a product by ID or slug
export async function PUT(
  request: Request,
  { params }: { params: { param: string } }
) {
  await dbConnect();

  try {
    const body = await request.json();

    let product: IProductDocument | null = null;

    if (isMongoId(params.param)) {
      product = await ProductModel.findById(params.param);
    } else {
      product = await ProductModel.findOne({ "basicInfo.slug": params.param });
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const productSectionKeys: (keyof ProductSections)[] = [
      "basicInfo",
      "pricing",
      "inventory",
      "flags",
      "media",
      "featuresSection",
      "tags",
      "ratingsAndReview",
      "warranty",
      "seo",
      "resources",
    ];

    // Update all sections that exist in the request body
    productSectionKeys.forEach((section) => {
      if (body[section]) {
        // Type-safe property access
        product[section] = {
          ...product[section],
          ...body[section],
        };
      }
    });

    // Handle any non-section fields (though your model doesn't have top-level fields)
    Object.keys(body).forEach((key) => {
      if (!productSectionKeys.includes(key as keyof ProductSections)) {
        // Explicitly handle unknown properties
        if (key in product) {
          (product as any)[key] = body[key];
        }
      }
    });

    // This will trigger pre-save hooks including validation and discount calculation
    const updatedProduct = await product.save();

    return NextResponse.json(
      {
        success: true,
        data: updatedProduct.toObject(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Update failed",
      },
      { status: 500 }
    );
  }
}

// DELETE a product by ID or slug
export async function DELETE(
  request: Request,
  { params }: { params: { param: string } }
) {
  await dbConnect();

  try {
    let deletedProduct;

    if (isMongoId(params.param)) {
      deletedProduct = await ProductModel.findByIdAndDelete(
        params.param
      ).lean();
    } else {
      deletedProduct = await ProductModel.findOneAndDelete({
        "basicInfo.slug": params.param,
      }).lean();
    }

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedProduct },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
