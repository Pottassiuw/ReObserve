const isDevelopment = import.meta.env.MODE === "development";

export const logInfo = (message: string, data?: any): void => {
  if (isDevelopment) {
    console.log(`[INFO] ${message}`, data);
  }
};

export const logWarn = (message: string, data?: any): void => {
  if (isDevelopment) {
    console.warn(`[WARN] ${message}`, data);
  }
};

export const logError = (message: string, error?: any): void => {
  console.error(`[ERROR] ${message}`, error);
};

export const logDebug = (message: string, data?: any): void => {
  if (isDevelopment) {
    console.debug(`[DEBUG] ${message}`, data);
  }
};

export const logAPI = (endpoint: string, method: string, data?: any): void => {
  if (isDevelopment) {
    console.log(`[API] ${method} ${endpoint}`, data);
  }
};
