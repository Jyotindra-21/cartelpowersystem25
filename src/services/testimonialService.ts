import { API_URL } from "@/lib/constant";
import { ITestimonialDocument } from "@/models/testimonialModel";
import { ITestimonial } from "@/schemas/testimonialSchema";
import { IApiResponse } from "@/types/ApiResponse";

export interface TestimonialFilterParams {
  searchQuery?: string;
  status?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "fullName";
  sortOrder?: "asc" | "desc";
  getAll?: boolean;
}

export async function fetchTestimonialById<T>(
  id: string
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch testimonial`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching testimonial:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateTestimonial<T>(
  id: string,
  data: Partial<ITestimonial>
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update testimonial`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating testimonial:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteTestimonial(
  id: string
): Promise<IApiResponse<{ _id: string }>> {
  try {
    const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete testimonial`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting testimonial:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function createTestimonial(
  testimonialData: Partial<ITestimonial>
): Promise<IApiResponse<ITestimonialDocument>> {
  try {
    const response = await fetch(`${API_URL}/api/testimonials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testimonialData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create testimonial");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function fetchTestimonials<T>(
  params: TestimonialFilterParams
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/testimonials/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch testimonials");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Simple GET all testimonials (without filtering)
export async function getAllTestimonials<T>(): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/testimonials/find`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch testimonials");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}