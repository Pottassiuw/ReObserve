/**
 * Logger utility for consistent logging throughout the application
 * Enables easy toggling between development and production modes
 */

const isDevelopment = import.meta.env.MODE === "development";

/**
 * Log information messages (only in development)
 */
export const logInfo = (message: string, data?: any): void => {
  if (isDevelopment) {
    console.log(`[INFO] ${message}`, data);
  }
};

/**
 * Log warning messages (only in development)
 */
export const logWarn = (message: string, data?: any): void => {
  if (isDevelopment) {
    console.warn(`[WARN] ${message}`, data);
  }
};

/**
 * Log error messages (always logged for debugging)
 */
export const logError = (message: string, error?: any): void => {
  console.error(`[ERROR] ${message}`, error);
};

/**
 * Log debug messages (only in development)
 */
export const logDebug = (message: string, data?: any): void => {
  if (isDevelopment) {
    console.debug(`[DEBUG] ${message}`, data);
  }
};

/**
 * Log API-related information (only in development)
 */
export const logAPI = (endpoint: string, method: string, data?: any): void => {
  if (isDevelopment) {
    console.log(`[API] ${method} ${endpoint}`, data);
  }
};
