import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ProductModel } from "@/models/productModel";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const requestBody = await request.json();

    // Validate requested section if provided
    const validSections = [
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

    const requestedSection = requestBody.section;
    if (requestedSection && !validSections.includes(requestedSection)) {
      return NextResponse.json(
        { success: false, error: "Invalid product section" },
        { status: 400 }
      );
    }

    // Build query object from request body
    const query: any = {};

    // Apply filters based on new model structure
    if (requestBody.brand) query["basicInfo.brand"] = requestBody.brand;

    // Boolean filters from flags section
    if (typeof requestBody.isActive === "boolean")
      query["flags.isActive"] = requestBody.isActive;
    if (typeof requestBody.isHighlighted === "boolean")
      query["flags.isHighlighted"] = requestBody.isHighlighted;
    if (typeof requestBody.isNewProduct === "boolean")
      query["flags.isNewProduct"] = requestBody.isNewProduct;
    if (typeof requestBody.isBanner === "boolean")
      query["flags.isBanner"] = requestBody.isBanner;

    // Inventory filters
    if (typeof requestBody.inStock === "boolean")
      query["inventory.inStock"] = requestBody.inStock;

    // Pricing filters
    if (typeof requestBody.hasDiscount === "boolean")
      query["pricing.hasDiscount"] = requestBody.hasDiscount;

    // Price range filter
    if (requestBody.minPrice || requestBody.maxPrice) {
      query["pricing.price"] = {};
      if (requestBody.minPrice)
        query["pricing.price"].$gte = parseFloat(
          requestBody.minPrice.toString()
        );
      if (requestBody.maxPrice)
        query["pricing.price"].$lte = parseFloat(
          requestBody.maxPrice.toString()
        );
    }

    // Search query - updated for nested fields
    if (requestBody.searchQuery) {
      query.$or = [
        {
          "basicInfo.name": { $regex: requestBody.searchQuery, $options: "i" },
        },
        {
          "basicInfo.description": {
            $regex: requestBody.searchQuery,
            $options: "i",
          },
        },
        {
          "basicInfo.shortDescription": {
            $regex: requestBody.searchQuery,
            $options: "i",
          },
        },
        {
          "featuresSection.keyFeatures": {
            $regex: requestBody.searchQuery,
            $options: "i",
          },
        },
        { "tags.tags": { $regex: requestBody.searchQuery, $options: "i" } },
      ];
    }

    // Sorting with defaults - updated for nested fields
    const sortBy = requestBody.sortBy || "createdAt";
    const sortOrder = requestBody.sortOrder || "desc";

    // Handle nested field sorting
    let sortOption: Record<string, 1 | -1> = {};
    if (sortBy === "price") {
      sortOption["pricing.price"] = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "name") {
      sortOption["basicInfo.name"] = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "rating") {
      sortOption["ratingsAndReview.rating"] = sortOrder === "desc" ? -1 : 1;
    } else {
      sortOption[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Create base query
    let baseQuery = ProductModel.find(query).sort(sortOption);

    // Apply section projection if requested
    if (requestedSection) {
      baseQuery = baseQuery.select(requestedSection);
    }

    // Handle getAll flag to bypass pagination
    if (requestBody.getAll) {
      const products = await baseQuery.lean();

      return NextResponse.json(
        {
          success: true,
          data: products,
          filters: {
            brand: requestBody.brand,
            inStock: requestBody.inStock,
            hasDiscount: requestBody.hasDiscount,
            isActive: requestBody.isActive,
            isHighlighted: requestBody.isHighlighted,
            isNewProduct: requestBody.isNewProduct,
            isBanner: requestBody.isBanner,
            priceRange: {
              min: requestBody.minPrice,
              max: requestBody.maxPrice,
            },
            searchQuery: requestBody.searchQuery,
          },
        },
        { status: 200 }
      );
    }

    // Default pagination behavior
    const page = parseInt(requestBody.page?.toString() || "1");
    const limit = parseInt(requestBody.limit?.toString() || "10");
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      baseQuery.skip(skip).limit(limit).lean(),
      ProductModel.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
        filters: {
          brand: requestBody.brand,
          inStock: requestBody.inStock,
          hasDiscount: requestBody.hasDiscount,
          isActive: requestBody.isActive,
          isHighlighted: requestBody.isHighlighted,
          isNewProduct: requestBody.isNewProduct,
          isBanner: requestBody.isBanner,
          priceRange: {
            min: requestBody.minPrice,
            max: requestBody.maxPrice,
          },
          searchQuery: requestBody.searchQuery,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
