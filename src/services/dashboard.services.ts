import { API_URL } from "@/lib/constant";
import { IApiResponse } from "@/types/ApiResponse";
import { DashboardDataType } from "@/types/commonTypes";

export interface IDashboardData {
  metrics: [];
  userGrowthByMonth: [];
  productGrowthByMonth: [];
  contactStatusData: [];
}
export async function fetchDashboard(): Promise<
  IApiResponse<DashboardDataType>
> {
  try {
    const response = await fetch(`${API_URL}/api/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Dashboard");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Dashboard:", error);
    return { success: false, error: "Failed to fetch Dashboard" };
  }
}
