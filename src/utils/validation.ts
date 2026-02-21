/**
 * Comprehensive validation utilities for tasks
 * Prepared to support push notifications and other features
 */

/**
 * Time format validation (HH:MM in 24-hour format)
 */
export const isValidTimeFormat = (time: string): boolean => {
  if (!time) return true; // Optional field
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Parse time string to hours and minutes
 */
export const parseTime = (time: string): { hours: number; minutes: number } | null => {
  if (!isValidTimeFormat(time)) return null;
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
};

/**
 * Format hours and minutes to HH:MM string
 */
export const formatTimeString = (hours: number, minutes: number): string => {
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * Convert 12-hour time to 24-hour format
 */
export const convertTo24Hour = (hours: number, minutes: number, period: 'AM' | 'PM'): string => {
  let h = hours;
  if (period === 'PM' && h !== 12) {
    h += 12;
  } else if (period === 'AM' && h === 12) {
    h = 0;
  }
  return formatTimeString(h, minutes);
};

/**
 * Convert 24-hour time to 12-hour format
 */
export const convertTo12Hour = (time: string): { hours: number; minutes: number; period: 'AM' | 'PM' } | null => {
  const parsed = parseTime(time);
  if (!parsed) return null;

  let { hours, minutes } = parsed;
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return { hours, minutes, period };
};

/**
 * Get minutes since midnight
 */
export const getMinutesSinceMidnight = (time: string): number => {
  const parsed = parseTime(time);
  if (!parsed) return 0;
  return parsed.hours * 60 + parsed.minutes;
};

/**
 * Validate date-time combination
 */
export const isValidDateTime = (date: string, time?: string): { valid: boolean; error?: string } => {
  if (!date) {
    return { valid: false, error: 'Date is required' };
  }

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }
  } catch {
    return { valid: false, error: 'Date parsing error' };
  }

  if (time && !isValidTimeFormat(time)) {
    return { valid: false, error: 'Invalid time format (use HH:MM)' };
  }

  return { valid: true };
};

/**
 * Validate task data before saving
 */
export interface TaskValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateTask = (taskData: {
  title?: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: string;
  recurrence?: any;
}): TaskValidationResult => {
  const errors: string[] = [];

  // Validate title
  if (!taskData.title || taskData.title.trim().length === 0) {
    errors.push('Task title is required');
  }

  if (taskData.title && taskData.title.length > 500) {
    errors.push('Task title must be less than 500 characters');
  }

  // Validate description
  if (taskData.description && taskData.description.length > 2000) {
    errors.push('Task description must be less than 2000 characters');
  }

  // Validate date and time
  if (taskData.dueDate) {
    const dateTimeValidation = isValidDateTime(taskData.dueDate, taskData.dueTime);
    if (!dateTimeValidation.valid) {
      errors.push(dateTimeValidation.error || 'Invalid date/time');
    }
  }

  // Validate priority
  if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  // Validate recurrence if present
  if (taskData.recurrence) {
    const recurrenceValidation = validateRecurrence(taskData.recurrence);
    if (!recurrenceValidation.valid) {
      errors.push(...recurrenceValidation.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate recurrence configuration
 */
export const validateRecurrence = (recurrence: any): TaskValidationResult => {
  const errors: string[] = [];

  if (!recurrence) {
    return { valid: true, errors: [] };
  }

  // Validate type
  const validTypes = ['none', 'daily', 'weekly', 'biweekly', 'monthly', 'custom'];
  if (recurrence.type && !validTypes.includes(recurrence.type)) {
    errors.push('Invalid recurrence type');
  }

  // Validate days of week
  if (recurrence.daysOfWeek) {
    if (!Array.isArray(recurrence.daysOfWeek)) {
      errors.push('Days of week must be an array');
    } else if (recurrence.daysOfWeek.some((d: any) => typeof d !== 'number' || d < 0 || d > 6)) {
      errors.push('Days of week must be numbers between 0-6');
    } else if (recurrence.daysOfWeek.length === 0) {
      errors.push('At least one day must be selected');
    }
  }

  // Validate day of month
  if (recurrence.dayOfMonth) {
    if (typeof recurrence.dayOfMonth !== 'number' || recurrence.dayOfMonth < 1 || recurrence.dayOfMonth > 31) {
      errors.push('Day of month must be between 1-31');
    }
  }

  // Validate month day pattern
  if (recurrence.monthDay) {
    const validMonthDays = ['first', 'second', 'third', 'fourth', 'last'];
    if (!validMonthDays.includes(recurrence.monthDay)) {
      errors.push('Invalid month day pattern');
    }
  }

  // Validate interval
  if (recurrence.interval && (typeof recurrence.interval !== 'number' || recurrence.interval < 1)) {
    errors.push('Interval must be a positive number');
  }

  // Validate dates
  if (recurrence.startDate) {
    try {
      new Date(recurrence.startDate);
    } catch {
      errors.push('Invalid start date');
    }
  }

  if (recurrence.endDate) {
    try {
      new Date(recurrence.endDate);
    } catch {
      errors.push('Invalid end date');
    }
    
    if (recurrence.startDate && recurrence.endDate) {
      if (new Date(recurrence.endDate) <= new Date(recurrence.startDate)) {
        errors.push('End date must be after start date');
      }
    }
  }

  // Validate occurrences count
  if (recurrence.occurrences && (typeof recurrence.occurrences !== 'number' || recurrence.occurrences < 1)) {
    errors.push('Occurrences must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate time picker inputs
 */
export const validateTimePicker = (hours: number, minutes: number): { valid: boolean; error?: string } => {
  if (typeof hours !== 'number' || hours < 0 || hours > 23) {
    return { valid: false, error: 'Hours must be between 0-23' };
  }

  if (typeof minutes !== 'number' || minutes < 0 || minutes > 59) {
    return { valid: false, error: 'Minutes must be between 0-59' };
  }

  return { valid: true };
};

/**
 * Suggest next valid time based on recurrence
 * Prepares for intelligent push notification scheduling
 */
export const suggestNextValidTime = (dueDate: string, dueTime: string, recurrence?: any): string => {
  // If no recurrence, return the time as-is
  if (!recurrence || recurrence.type === 'none' || !dueTime) {
    return dueTime;
  }

  // Ensure time is in valid format
  if (!isValidTimeFormat(dueTime)) {
    return '09:00'; // Default morning time
  }

  return dueTime;
};

/**
 * Validate notification settings preparation
 * Used for future push notification integration
 */
export const validateNotificationPrep = (taskData: {
  dueDate?: string;
  dueTime?: string;
  recurrence?: any;
}): { canNotify: boolean; reason?: string; suggestedTime?: string } => {
  // Date required for notifications
  if (!taskData.dueDate) {
    return { canNotify: false, reason: 'Notification requires due date' };
  }

  // Time validation
  if (taskData.dueTime) {
    if (!isValidTimeFormat(taskData.dueTime)) {
      return { canNotify: false, reason: 'Invalid time format for notification' };
    }
  }

  // Recurrence validation
  if (taskData.recurrence) {
    const validation = validateRecurrence(taskData.recurrence);
    if (!validation.valid) {
      return { canNotify: false, reason: 'Invalid recurrence configuration' };
    }
  }

  return {
    canNotify: true,
    suggestedTime: taskData.dueTime || '09:00',
  };
};

/**
 * Sanitize task input
 */
export const sanitizeTaskInput = (taskData: any): any => {
  return {
    title: taskData.title?.trim() || '',
    description: taskData.description?.trim() || '',
    dueDate: taskData.dueDate?.trim() || '',
    dueTime: taskData.dueTime?.trim() || '',
    priority: taskData.priority?.toLowerCase() || 'medium',
    recurrence: taskData.recurrence,
  };
};
