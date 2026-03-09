/**
 * Application configuration and constants
 * Centralizes hardcoded values to improve maintainability
 */

// Storage configuration
export const STORAGE_CONFIG = {
  IMAGE_BUCKET_NAME: "Imagens",
  XML_BUCKET_NAME: import.meta.env.VITE_XML_BUCKET_NAME || "Xml",
  IMAGE_FOLDER: import.meta.env.VITE_IMAGE_FOLDER || "imagens",
  XML_FOLDER: import.meta.env.VITE_XML_FOLDER || "xml",
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_FORMATS: ["image/jpeg", "image/png", "image/gif"],
  ALLOWED_XML_FORMATS: ["application/xml", "text/xml", "text/plain"],
} as const;

// API configuration
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Date and time configuration
export const DATE_FORMAT = {
  DEFAULT: "pt-BR",
  DEFAULT_PATTERN: "dd/MM/yyyy",
  TIME_PATTERN: "HH:mm:ss",
  DATETIME_PATTERN: "dd/MM/yyyy HH:mm:ss",
} as const;

// UI configuration
export const UI_CONFIG = {
  TOAST_DURATION: 3000, // milliseconds
  LOADER_ANIMATION: "spin",
  BREAKPOINT_MOBILE: "md", // Tailwind breakpoint for mobile
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ERROR_REPORTING: true,
  ENABLE_ANALYTICS: false,
  ENABLE_DEBUG_MODE: import.meta.env.DEV,
} as const;
