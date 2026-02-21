/**
 * Recurrence utility functions for managing recurring tasks
 */

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';

export interface RecurrenceConfig {
  type: RecurrenceType;
  interval?: number; // e.g., every 2 weeks
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  dayOfMonth?: number; // 1-31
  monthDay?: 'first' | 'second' | 'third' | 'fourth' | 'last'; // first Monday, last Friday, etc
  monthDayName?: number; // 0-6 for day of week (Monday=1)
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string (optional)
  occurrences?: number; // max repetitions (optional)
}

export interface RecurringTaskInfo {
  isRecurring: boolean;
  recurrence: RecurrenceConfig;
  nextOccurrence?: string;
  lastGenerated?: string;
  generatedCount?: number;
}

/**
 * Get the next occurrence date for a recurring task
 */
export const getNextOccurrence = (
  currentDate: string,
  recurrence: RecurrenceConfig
): string | null => {
  const date = new Date(currentDate);
  date.setHours(0, 0, 0, 0);

  let nextDate = new Date(date);

  switch (recurrence.type) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;

    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;

    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;

    case 'monthly':
      if (recurrence.monthDay && recurrence.monthDayName !== undefined) {
        // e.g., "first Monday" of month
        nextDate = getMonthDayOccurrence(date, recurrence.monthDay, recurrence.monthDayName, 1);
      } else if (recurrence.dayOfMonth) {
        // e.g., 15th of every month
        nextDate.setMonth(nextDate.getMonth() + 1);
        nextDate.setDate(recurrence.dayOfMonth);
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      break;

    case 'custom':
      if (recurrence.interval && recurrence.daysOfWeek) {
        // Custom interval with specific days
        nextDate = getNextCustomDate(date, recurrence.interval, recurrence.daysOfWeek);
      }
      break;
  }

  // Check end date
  if (recurrence.endDate && nextDate > new Date(recurrence.endDate)) {
    return null;
  }

  return nextDate.toISOString().split('T')[0];
};

/**
 * Get the nth occurrence of a day in a month
 * e.g., "second Monday" of March
 */
const getMonthDayOccurrence = (
  fromDate: Date,
  occurrence: string,
  dayOfWeek: number,
  monthOffset: number
): Date => {
  const target = new Date(fromDate);
  target.setMonth(target.getMonth() + monthOffset);
  target.setDate(1);

  const occurrenceMap = {
    first: 0,
    second: 1,
    third: 2,
    fourth: 3,
    last: 4,
  };

  const occurrenceIndex = occurrenceMap[occurrence as keyof typeof occurrenceMap] || 0;

  // Find first occurrence of dayOfWeek
  while (target.getDay() !== dayOfWeek) {
    target.setDate(target.getDate() + 1);
  }

  if (occurrence === 'last') {
    // For last, go to last occurrence in month
    const nextMonth = new Date(target);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(0); // Last day of previous month

    while (nextMonth.getDay() !== dayOfWeek) {
      nextMonth.setDate(nextMonth.getDate() - 1);
    }
    return nextMonth;
  } else {
    // Add weeks for other occurrences
    target.setDate(target.getDate() + occurrenceIndex * 7);
  }

  return target;
};

/**
 * Get next occurrence for custom interval (e.g., every 2 weeks on Thursday)
 */
const getNextCustomDate = (
  fromDate: Date,
  interval: number,
  daysOfWeek: number[]
): Date => {
  const nextDate = new Date(fromDate);
  nextDate.setDate(nextDate.getDate() + 1);

  // Find next occurrence within interval
  let daysChecked = 0;
  const maxDays = interval * 7;

  while (daysChecked < maxDays) {
    if (daysOfWeek.includes(nextDate.getDay())) {
      return nextDate;
    }
    nextDate.setDate(nextDate.getDate() + 1);
    daysChecked++;
  }

  // If not found in current interval, move to next interval
  nextDate.setDate(nextDate.getDate() + interval * 7 - daysChecked);
  return nextDate;
};

/**
 * Check if a date matches the recurrence pattern
 */
export const isMatchingRecurrence = (
  date: string,
  recurrence: RecurrenceConfig
): boolean => {
  const checkDate = new Date(date);
  const dayOfWeek = checkDate.getDay();
  const dayOfMonth = checkDate.getDate();

  switch (recurrence.type) {
    case 'daily':
      return true;

    case 'weekly':
      return recurrence.daysOfWeek?.includes(dayOfWeek) ?? false;

    case 'biweekly':
      return recurrence.daysOfWeek?.includes(dayOfWeek) ?? false;

    case 'monthly':
      if (recurrence.monthDay && recurrence.monthDayName !== undefined) {
        return isMonthDayMatch(checkDate, recurrence.monthDay, recurrence.monthDayName);
      }
      return dayOfMonth === recurrence.dayOfMonth;

    case 'custom':
      return recurrence.daysOfWeek?.includes(dayOfWeek) ?? false;

    default:
      return false;
  }
};

/**
 * Check if a date matches the month day pattern
 */
const isMonthDayMatch = (date: Date, monthDay: string, dayOfWeek: number): boolean => {
  if (date.getDay() !== dayOfWeek) return false;

  const occurrenceMap = {
    first: 0,
    second: 1,
    third: 2,
    fourth: 3,
    last: 4,
  };

  const occurrence = occurrenceMap[monthDay as keyof typeof occurrenceMap];
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  if (monthDay === 'last') {
    // Check if this is the last occurrence of dayOfWeek in the month
    const nextWeek = new Date(date);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.getMonth() !== date.getMonth();
  } else {
    // Find the occurrence-th occurrence of dayOfWeek
    let current = new Date(firstOfMonth);
    while (current.getDay() !== dayOfWeek) {
      current.setDate(current.getDate() + 1);
    }
    current.setDate(current.getDate() + occurrence * 7);
    return (
      current.getDate() === date.getDate() &&
      current.getMonth() === date.getMonth() &&
      current.getFullYear() === date.getFullYear()
    );
  }
};

/**
 * Get human-readable recurrence description
 */
export const getRecurrenceDescription = (recurrence: RecurrenceConfig): string => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  switch (recurrence.type) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      if (recurrence.daysOfWeek?.length === 7) return 'Every day';
      if (recurrence.daysOfWeek?.length === 1)
        return `Every ${dayNames[recurrence.daysOfWeek[0]]}`;
      const days = recurrence.daysOfWeek?.map(d => dayNames[d]).join(', ') || '';
      return `Every ${days}`;
    case 'biweekly':
      if (recurrence.daysOfWeek?.length === 1)
        return `Every 2 weeks on ${dayNames[recurrence.daysOfWeek[0]]}`;
      return 'Every 2 weeks';
    case 'monthly':
      if (recurrence.monthDay && recurrence.monthDayName !== undefined) {
        const occurrenceText = {
          first: '1st',
          second: '2nd',
          third: '3rd',
          fourth: '4th',
          last: 'Last',
        }[recurrence.monthDay];
        return `Every ${occurrenceText} ${dayNames[recurrence.monthDayName]} of the month`;
      }
      return `Monthly on day ${recurrence.dayOfMonth}`;
    case 'custom':
      if (recurrence.interval && recurrence.daysOfWeek) {
        const dayList = recurrence.daysOfWeek.map(d => dayNames[d]).join(', ');
        return `Every ${recurrence.interval} weeks on ${dayList}`;
      }
      return 'Custom';
    default:
      return 'Never';
  }
};

/**
 * Parse recurrence description and create config
 */
export const parseRecurrenceDescription = (description: string): RecurrenceConfig | null => {
  // Basic pattern matching for common formats
  const patterns = {
    daily: /daily/i,
    weekly: /every (?:week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
    biweekly: /every 2 weeks/i,
    monthly: /monthly|every \d+(?:st|nd|rd|th)/i,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(description)) {
      return { type: type as RecurrenceType };
    }
  }

  return null;
};
