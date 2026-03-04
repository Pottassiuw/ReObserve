/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Formats a date to YYYY-MM-DD format
 * @param date - Date object or string to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDateToISO = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
};

/**
 * Parses an ISO date string (YYYY-MM-DD) to a Date object
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object
 */
export const parseISODate = (dateString: string): Date => {
  return new Date(`${dateString}T00:00:00Z`);
};

/**
 * Gets the current date in YYYY-MM-DD format
 * @returns Today's date as YYYY-MM-DD string
 */
export const getTodayISO = (): string => {
  return formatDateToISO(new Date());
};

/**
 * Formats a date for display purposes (human readable)
 * @param date - Date object or string
 * @param locale - Locale string (default: 'pt-BR')
 * @returns Formatted date string
 */
export const formatDateForDisplay = (
  date: Date | string,
  locale: string = "pt-BR",
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns true if the date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate()
  );
};

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns true if the date is before today
 */
export const isPastDate = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj < today;
};

/**
 * Adds days to a date
 * @param date - Starting date
 * @param days - Number of days to add
 * @returns New date with days added
 */
export const addDays = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

/**
 * Calculates the difference in days between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days between the dates
 */
export const daysBetween = (
  startDate: Date | string,
  endDate: Date | string,
): number => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
