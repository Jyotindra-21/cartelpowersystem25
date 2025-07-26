import { User } from "@/app/(adminpannel)/admin/users/_components/types";
import { API_URL } from "@/lib/constant";
import { IApiResponse } from "@/types/ApiResponse";

type FetchUsersParams = {
  role?: "admin" | "user";
  searchQuery?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "username" | "email" | "role";
  sortOrder?: "asc" | "desc";
  getAll?: boolean;
};

export async function fetchUsers(
  params: FetchUsersParams
): Promise<IApiResponse<User[]>> {
  try {
    const response = await fetch(`${API_URL}/api/users/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function fetchUser(params: {
  id: string;
}): Promise<IApiResponse<User>> {
  try {
    const response = await fetch(`${API_URL}/api/users/${params.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

export const updateUserProfile = async (updateData: {
  username?: string;
  email?: string;
  name?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  image?: string;
  banner?: string;
}): Promise<IApiResponse<User>> => {
  try {
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};
