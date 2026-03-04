import type { ApiError } from "../../types/index";
import { logError } from "../../utils/logger";

export interface ApiResponseHandler<T> {
  data: T | null;
  error: ApiError | null;
}

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

export const validateResponseData = (
  data: any,
  requiredFields: string[],
): boolean => {
  if (!data) return false;
  return requiredFields.every(
    (field) => data[field] !== undefined && data[field] !== null,
  );
};
