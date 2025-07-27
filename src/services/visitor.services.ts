// lib/actions/visitorActions.ts
import { VisitorPaginationParams } from "@/app/api/visitor/route";
import { API_URL } from "@/lib/constant";
import { IApiResponse } from "@/types/ApiResponse";

export async function getVisitorById(
  visitorId: string
): Promise<IApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/api/visitor/${visitorId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch visitor");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching visitor:", error);
    return { success: false, error: "Failed to fetch visitors" };
  }
}

export async function getVisitors(
  params: VisitorPaginationParams
): Promise<IApiResponse<any[]>> {
  try {
    const response = await fetch(`${API_URL}/api/visitor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `Failed to fetch visitors (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch visitors",
    };
  }
}

export async function deleteVisitor(
  visitorIds: string | string[]
): Promise<IApiResponse<{ deletedCount: number }>> {
  try {
    // Normalize to array (handles both single ID and array of IDs)
    const idsArray = Array.isArray(visitorIds) ? visitorIds : [visitorIds];

    const response = await fetch(`${API_URL}/api/visitor`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visitorIds: idsArray }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `Failed to delete visitor(s) (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        deletedCount: data.data?.deletedCount || idsArray.length,
      },
      message:
        data.message ||
        (idsArray.length === 1
          ? "Visitor deleted successfully"
          : `${idsArray.length} visitors deleted successfully`),
    };
  } catch (error) {
    console.error("Error deleting visitor(s):", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete visitor(s)",
    };
  }
}
