/**
 * Standard API response format used by all server actions
 */
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
