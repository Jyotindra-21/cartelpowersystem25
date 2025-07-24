// src/services/contactService.ts
import { API_URL } from "@/lib/constant";
import { IContactForm, IContactFormCreateSchema } from "@/schemas/contactSchema";
import { IApiResponse } from "@/types/ApiResponse";

export interface ContactFilterParams {
  status?: "new" | "inprogress" | "resolved";
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "status";
  sortOrder?: "asc" | "desc";
  getAll?: boolean;
}
/**
 * Submit a new contact form
 */
export async function saveContact(
  contactData: Omit<IContactFormCreateSchema, "status" | "createdAt" | "updatedAt">
): Promise<IApiResponse<IContactForm>> {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `Failed to save contact (HTTP ${response.status})`
      );
    }
    const result: IApiResponse<IContactForm> = await response.json();
    // Ensure the response matches your route's structure
    if (!result.success) {
      throw new Error(result.error || "Contact submission failed");
    }
    return {
      success: true,
      data: result.data,
      message: result.message || "Contact saved successfully",
    };
  } catch (error) {
    console.error("Error saving contact:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save contact",
    };
  }
}

export async function getContacts(
  params: ContactFilterParams
): Promise<IApiResponse<IContactForm[]>> {
  try {
    const response = await fetch(`${API_URL}/api/contact/find`, {
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
        `Failed to fetch contacts (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      pagination: data.pagination,
    };

  } catch (error) {
    console.error("Error fetching contacts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch contacts",
    };
  }
}

export async function updateContactStatus(
  contactId: string,
  status: "new" | "inprogress" | "resolved"
): Promise<IApiResponse<IContactForm>> {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contactId, status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 
        errorData.message || 
        `Failed to update status (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      message: data.message || "Status updated successfully",
    };

  } catch (error) {
    console.error("Error updating contact status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    };
  }
}

export async function deleteContact(
  contactIds: string | string[]
): Promise<IApiResponse<{ deletedCount: number }>> {
  try {
    // Normalize to array (handles both single ID and array of IDs)
    const idsArray = Array.isArray(contactIds) ? contactIds : [contactIds];
    
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contactIds: idsArray }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 
        errorData.message || 
        `Failed to delete contact(s) (HTTP ${response.status})`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        deletedCount: data.data?.deletedCount || idsArray.length
      },
      message: data.message || 
        (idsArray.length === 1 
          ? "Contact deleted successfully" 
          : `${idsArray.length} contacts deleted successfully`),
    };

  } catch (error) {
    console.error("Error deleting contact(s):", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete contact(s)",
    };
  }
}