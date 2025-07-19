import { format as dateFnsFormat, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatDate = (date, format = 'MMM d, yyyy') => {
  if (!date) return 'N/A';
  
  const dateObj = date?.toDate ? date.toDate() : new Date(date);
  
  // Handle invalid date
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  // Return relative time for recent dates
  if (isToday(dateObj)) {
    return `Today, ${dateFnsFormat(dateObj, 'h:mm a')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday, ${dateFnsFormat(dateObj, 'h:mm a')}`;
  }
  
  // For dates within the last 7 days
  const daysAgo = Math.ceil((new Date() - dateObj) / (1000 * 60 * 60 * 24));
  if (daysAgo <= 7) {
    return `${formatDistanceToNow(dateObj, { addSuffix: true })}`;
  }
  
  // Otherwise, use the specified format
  return dateFnsFormat(dateObj, format);
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toISOString().split('T')[0];
};

export const formatDateLong = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = date?.toDate ? date.toDate() : new Date(date);
  
  // Handle invalid date
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  // Format as "Month Day, Year" (e.g., "January 1, 2023")
  return dateFnsFormat(dateObj, 'MMMM d, yyyy');
};

export const formatDateTimeForInput = (date) => {
  if (!date) return '';
  const dateObj = date?.toDate ? date.toDate() : new Date(date);
  return dateFnsFormat(dateObj, "yyyy-MM-dd'T'HH:mm");
};
