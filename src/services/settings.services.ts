import { API_URL } from "@/lib/constant";
import {
  IFooterSection,
  IHeroSection,
  IOurStorySection,
  ISettings,
  ISettingsCreateInput,
  ISettingsUpdateInput,
  IWebsiteInfo,
  IWeWorkAcrossSection,
} from "@/schemas/settingsSchema";
import { IApiResponse } from "@/types/ApiResponse";

export type SettingsSection =
  | "website-info"
  | "hero-section"
  | "our-story"
  | "we-work-across"
  | "footer";

interface FetchSettingsParams {
  filters?: {
    searchQuery?: string;
  };
  pagination?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
}

export async function fetchSettings(
  params?: FetchSettingsParams
): Promise<IApiResponse<ISettings>> {
  const response = await fetch(`${API_URL}/api/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operation: "fetch",
      filters: params?.filters,
      pagination: {
        page: params?.pagination?.page || 1,
        limit: params?.pagination?.limit || 10,
        sortBy: params?.pagination?.sortBy || "createdAt",
        sortOrder: params?.pagination?.sortOrder || "desc",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch settings");
  }

  return await response.json();
}

// Create new settings
export async function createSettings(params: ISettingsCreateInput): Promise<{
  success: boolean;
  data: ISettings;
}> {
  const response = await fetch(`${API_URL}/api/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operation: "create",
      ...params,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create settings");
  }

  return await response.json();
}

// Update existing settings
export async function updateSettings(params: ISettingsUpdateInput): Promise<{
  success: boolean;
  data: ISettings;
}> {
  const response = await fetch(`${API_URL}/api/settings`, {
    method: "POST", // or "PUT" if you prefer
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operation: "update",
      ...params,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update settings");
  }

  return await response.json();
}

export async function fetchWebsiteInfo(): Promise<IApiResponse<IWebsiteInfo>> {
  return fetchSectionSettings("website-info");
}

export async function updateWebsiteInfo(
  data: IWebsiteInfo
): Promise<IApiResponse<IWebsiteInfo>> {
  return updateSectionSettings("website-info", data);
}

export async function fetchHeroSection(): Promise<IApiResponse<IHeroSection>> {
  return fetchSectionSettings("hero-section");
}

export async function updateHeroSection(
  data: IHeroSection
): Promise<IApiResponse<IHeroSection>> {
  return updateSectionSettings("hero-section", data);
}

export async function fetchOurStorySection(): Promise<
  IApiResponse<IOurStorySection>
> {
  return fetchSectionSettings("our-story");
}

export async function updateOurStorySection(
  data: IOurStorySection
): Promise<IApiResponse<IOurStorySection>> {
  return updateSectionSettings("our-story", data);
}

export async function fetchWeWorkAcross(): Promise<
  IApiResponse<IWeWorkAcrossSection>
> {
  return fetchSectionSettings("we-work-across");
}

export async function updateWeWorkAcross(
  data: IWeWorkAcrossSection
): Promise<IApiResponse<IWeWorkAcrossSection>> {
  return updateSectionSettings("we-work-across", data);
}

export async function fetchFooterSection(): Promise<
  IApiResponse<IFooterSection>
> {
  return fetchSectionSettings("footer");
}

export async function updateFooterSection(
  data: IFooterSection
): Promise<IApiResponse<IFooterSection>> {
  return updateSectionSettings("footer", data);
}

// Base functions
export async function fetchSectionSettings<T>(
  section: SettingsSection
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/settings/${section}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch ${section}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${section}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateSectionSettings<T>(
  section: SettingsSection,
  data: T
): Promise<IApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}/api/settings/${section}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
