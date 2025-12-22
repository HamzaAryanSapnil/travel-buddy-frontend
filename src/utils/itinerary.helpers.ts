// Helper function to convert datetime-local to ISO format
// datetime-local format: "2025-01-15T09:00" (local time, no timezone)
// We need to treat it as local time and convert to UTC correctly
export const convertToISO = (
  datetimeLocal: string | null | undefined,
  planDayDate: Date
) => {
  if (!datetimeLocal || datetimeLocal.trim() === "") return undefined;

  try {
    // datetime-local is already in local timezone
    // JavaScript's Date constructor will interpret it correctly as local time
    // and toISOString() will convert it to UTC
    let date: Date;
    if (planDayDate) {
      // Parse the datetime-local string to get time
      const inputDate = new Date(datetimeLocal);

      // Create a new date using planDayDate but with the time from input
      date = new Date(planDayDate);
      date.setHours(
        inputDate.getHours(),
        inputDate.getMinutes(),
        inputDate.getSeconds(),
        inputDate.getMilliseconds()
      );
    } else {
      // Fallback: use the datetime string as-is
      date = new Date(datetimeLocal);
    }
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return undefined;
    }

    return date.toISOString();
  } catch (error) {
    console.error("Error converting to ISO:", error);
    return undefined;
  }
};

// Helper function to calculate the actual date for a dayIndex
export const getDateForDayIndex = (startDate: Date, dayIndex: number): Date => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + (dayIndex - 1));
  // Reset to start of day to avoid time issues
  date.setHours(0, 0, 0, 0);
  return date;
};
