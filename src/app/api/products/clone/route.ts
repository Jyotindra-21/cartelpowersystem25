import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { IProductDocument, ProductModel } from "@/models/productModel";
import { generateSlug } from "../route";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { originalId } = await request.json();

    // Find original product with proper typing

    const originalProduct = await ProductModel.findById(originalId);

    if (!originalProduct || !originalProduct.basicInfo) {
      return NextResponse.json(
        { success: false, error: "Original product not found or invalid" },
        { status: 404 }
      );
    }

    const productData = originalProduct.toObject();

    // Prepare cloned data with required basicInfo
    const clonedProduct = {
      ...productData,
      basicInfo: {
        ...productData.basicInfo,
        name: `Copy of ${productData.basicInfo.name}`,
      },
      inventory: {
        ...productData.inventory,
        sku: `COPY-${Math.random().toString(36).substring(2, 6)}`,
      },
      // Transform tags from object to array
      tags: {
        tags: Array.isArray(productData.tags)
          ? productData.tags
          : productData.tags?.tags || [],
      },
      // Extract just the warranty string
      warranty: {
        warranty:
          typeof productData.warranty === "string"
            ? productData.warranty
            : productData.warranty?.warranty || "",
        warrantyDuration: productData.warranty?.warrantyDuration || "",
        supportInfo: productData.warranty?.supportInfo || "",
      },
      // Ensure dates are fresh
      createdAt: new Date(),
      updatedAt: new Date(),
      // Remove the _id to create a new document
      _id: undefined,
      __v: undefined,
    } as IProductDocument;

    // Generate new slug - now safe because basicInfo is required
    const newSlug = generateSlug(clonedProduct.basicInfo.name);
    clonedProduct.basicInfo.slug = newSlug;

    // Check for slug uniqueness
    const existingProduct = await ProductModel.findOne({
      "basicInfo.slug": newSlug,
    });

    if (existingProduct) {
      clonedProduct.basicInfo.slug = `${newSlug}-${Math.random().toString(36).substring(2, 5)}`;
    }


    // Create the cloned product
    const newProduct = await ProductModel.create(clonedProduct);

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        error: "Product cloned successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product cloning error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Product cloning failed",
      },
      { status: 500 }
    );
  }
}
