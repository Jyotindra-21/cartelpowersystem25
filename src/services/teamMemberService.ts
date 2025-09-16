import { API_URL } from "@/lib/constant";
import { ITeamMemberDocument } from "@/models/teamMemberModel";
import { ITeamMember } from "@/schemas/teamMemberSchema";
import { IApiResponse } from "@/types/ApiResponse";

export interface TeamMemberFilterParams {
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

export async function fetchTeamMemberById<T>(
  id: string
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/teammembers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch Team Member`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching Team Member:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateTeamMember<T>(
  id: string,
  data: Partial<ITeamMember>
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/teammembers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update Team Member`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating Team Member:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteTeamMember(
  id: string
): Promise<IApiResponse<{ _id: string }>> {
  try {
    const response = await fetch(`${API_URL}/api/teammembers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete Team Member`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting Team Member:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function createTeamMember(
  teamMemberData: Partial<ITeamMember>
): Promise<IApiResponse<ITeamMemberDocument>> {
  try {
    const response = await fetch(`${API_URL}/api/teammembers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamMemberData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create Team Member");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Team Member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function fetchTeamMembers<T>(
  params: TeamMemberFilterParams
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/teammembers/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch Team Members");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching teamMembers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Simple GET all teamMembers (without filtering)
export async function getAllTeamMembers<T>(): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/teammembers/find`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch Team Member");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching teamMembers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}