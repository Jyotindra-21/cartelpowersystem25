import { API_URL } from "@/lib/constant";
import { IProductDocument } from "@/models/productModel";
import { IProduct, ProductSections } from "@/schemas/productsSchema";
import { IApiResponse } from "@/types/ApiResponse";


export async function fetchProductByIdOrSlug<T>(
  param: string
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/products/${param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch product`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching product:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateProductSection<T>(
  param: string,
  section: keyof ProductSections,
  data: Partial<ProductSections[keyof ProductSections]>
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/products/${param}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ [section]: data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update ${section}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteProduct(
  param: string
): Promise<IApiResponse<{ _id: string }>> {
  try {
    const response = await fetch(`${API_URL}/api/products/${param}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete product`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting product:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function createProduct(
  productData: Partial<IProduct>
): Promise<IApiResponse<IProductDocument>> {
  try {
    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function fetchProducts<T>(params: {
  section?: string;
  brand?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
  isNewProduct?: boolean;
  isBanner?: boolean;
  inStock?: boolean;
  hasDiscount?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  getAll?: boolean;
  page?: number;
  limit?: number;
}): Promise<IApiResponse<T>> {
  // Using 'any' since we're not creating new interfaces
  try {
    const response = await fetch(`${API_URL}/api/products/find-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

interface SlugCheckResponse {
  existingProduct?: {
    id: string;
    name: string;
  };
}

export async function checkSlugAvailability(
  slug: string
): Promise<IApiResponse<SlugCheckResponse>> {
  try {
    const response = await fetch(
      `${API_URL}/api/products/check-slug?slug=${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to check slug availability");
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking slug:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function cloneProduct(
  originalId: string
): Promise<IApiResponse<IProductDocument>> {
  try {
    const response = await fetch(`${API_URL}/api/products/clone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to clone product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error cloning product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
