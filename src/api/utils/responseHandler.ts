/**
 * API response handler utility for consistent error and success handling
 * Reduces code duplication across all API endpoint files
 */

import type { ApiError } from "../../types/index";
import { logError } from "../../utils/logger";

/**
 * Standard structure for API responses
 */
export interface ApiResponseHandler<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * Handles API responses and extracts data
 * Provides consistent error handling and logging
 *
 * @param response - The API response object
 * @param errorContext - Context for error messages (e.g., 'fetching releases')
 * @returns Extracted data or null if response is invalid
 */
export const handleApiResponse = <T>(
  response: any,
  errorContext: string = "API request",
): T | null => {
  if (!response) {
    logError(`${errorContext}: Empty response received`);
    return null;
  }

  if (response.data) {
    return response.data as T;
  }

  logError(`${errorContext}: Invalid response structure`, response);
  return null;
};

/**
 * Creates a standardized API error
 *
 * @param error - The error object or string
 * @param statusCode - HTTP status code
 * @param context - Context for the error
 * @returns ApiError object
 */
export const createApiError = (
  error: any,
  statusCode?: number,
  context?: string,
): ApiError => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "An unknown error occurred";

  const apiError: ApiError = new Error(message) as ApiError;
  apiError.status = statusCode || error?.response?.status;
  apiError.code = error?.response?.data?.code;
  apiError.data = error?.response?.data;

  logError(`API Error [${context || "Unknown"}]`, {
    message: apiError.message,
    status: apiError.status,
    code: apiError.code,
  });

  return apiError;
};

/**
 * Wraps an async API call with consistent error handling
 *
 * @param apiCall - The async function to execute
 * @param errorContext - Context for error messages
 * @returns Response handler with data or error
 */
export const executeApiCall = async <T>(
  apiCall: () => Promise<any>,
  errorContext: string = "API call",
): Promise<ApiResponseHandler<T>> => {
  try {
    const response = await apiCall();
    const data = handleApiResponse<T>(response, errorContext);
    return { data, error: null };
  } catch (error: any) {
    const apiError = createApiError(error, undefined, errorContext);
    return { data: null, error: apiError };
  }
};

/**
 * Validates that a response has required fields
 *
 * @param data - The data to validate
 * @param requiredFields - Array of required field names
 * @returns true if all required fields exist
 */
export const validateResponseData = (
  data: any,
  requiredFields: string[],
): boolean => {
  if (!data) return false;
  return requiredFields.every(
    (field) => data[field] !== undefined && data[field] !== null,
  );
};
