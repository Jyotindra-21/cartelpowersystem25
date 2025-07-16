export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface ProductFilterParams {
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
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IApiResponse<T, F> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: Pagination;
  filters?: F;
}
