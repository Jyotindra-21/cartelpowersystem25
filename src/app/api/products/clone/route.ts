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

    const clonedProduct = {
      basicInfo: {
        slug: `Copy of ${productData.basicInfo.slug}`,
        name: `Copy of ${productData.basicInfo.name}`,
        brand: productData.brand,
        shortDescription: productData.shortDescription,
        description: productData.description,
      },
      media: {
        ...productData.media,
      },
      pricing: {
        ...productData.pricing,
      },
      inventory: {
        ...productData.inventory,
        sku: `COPY-${Math.random().toString(36).substring(2, 6)}`,
      },
      featuresSection: {
        ...productData.featuresSection,
      },
      tags: {
        tags: Array.isArray(productData.tags)
          ? productData.tags
          : productData.tags?.tags || [],
      },
      warranty: {
        warranty:
          typeof productData.warranty === "string"
            ? productData.warranty
            : productData.warranty?.warranty || "",
        warrantyDuration: productData.warranty?.warrantyDuration || "",
        supportInfo: productData.warranty?.supportInfo || "",
      },
      flags: {
        isNewProduct: true,
        isBanner: false,
        isHighlighted: false,
        isActive: true,
      },
      seo: {
        ...productData.seo,
      },
      resources: {
        ...productData.resources,
      },
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
