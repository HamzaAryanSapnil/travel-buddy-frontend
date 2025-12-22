/**
 * Utility functions for travel plan date-based logic
 * All date comparisons normalize to start of day (00:00:00) for consistency
 */

/**
 * Normalize a date to start of day (00:00:00) for comparison
 */
const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Check if plan endDate has passed (plan is completed)
 */
export const isPlanCompleted = (startDate: string, endDate: string): boolean => {
  const today = normalizeDate(new Date());
  const planEndDate = normalizeDate(new Date(endDate));
  return planEndDate < today;
};

/**
 * Check if plan is ongoing (startDate passed but endDate not passed)
 */
export const isPlanOngoing = (startDate: string, endDate: string): boolean => {
  const today = normalizeDate(new Date());
  const planStartDate = normalizeDate(new Date(startDate));
  const planEndDate = normalizeDate(new Date(endDate));
  return planStartDate <= today && planEndDate >= today;
};

/**
 * Check if plan is upcoming (both dates in future)
 */
export const isPlanUpcoming = (startDate: string, endDate: string): boolean => {
  const today = normalizeDate(new Date());
  const planStartDate = normalizeDate(new Date(startDate));
  const planEndDate = normalizeDate(new Date(endDate));
  return planStartDate > today && planEndDate > today;
};

/**
 * Get actual date for a day index (1-based)
 */
export const getDateForDayIndex = (startDate: string, dayIndex: number): Date => {
  const planStartDate = normalizeDate(new Date(startDate));
  const dayDate = new Date(planStartDate);
  dayDate.setDate(planStartDate.getDate() + (dayIndex - 1));
  return normalizeDate(dayDate);
};

/**
 * Check if a specific day (by dayIndex) has passed
 */
export const isDayPast = (startDate: string, dayIndex: number): boolean => {
  const today = normalizeDate(new Date());
  const dayDate = getDateForDayIndex(startDate, dayIndex);
  return dayDate < today;
};

/**
 * Get the first day index that can be edited (today or next future day)
 * Returns the dayIndex that corresponds to today if plan has started, or day 1 if plan hasn't started
 */
export const getFirstEditableDayIndex = (startDate: string, endDate: string): number => {
  const today = normalizeDate(new Date());
  const planStartDate = normalizeDate(new Date(startDate));
  const planEndDate = normalizeDate(new Date(endDate));

  // If plan hasn't started yet, first editable day is day 1
  if (planStartDate > today) {
    return 1;
  }

  // If plan has ended, no editable days (but this shouldn't be called in that case)
  if (planEndDate < today) {
    return 1; // Fallback, shouldn't happen
  }

  // Calculate which day today corresponds to (1-based)
  const diffTime = today.getTime() - planStartDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const todayDayIndex = diffDays + 1;

  // Total days in plan
  const totalTime = planEndDate.getTime() - planStartDate.getTime();
  const totalDays = Math.floor(totalTime / (1000 * 60 * 60 * 24)) + 1;

  // Return today's day index, clamped to valid range
  return Math.max(1, Math.min(todayDayIndex, totalDays));
};

