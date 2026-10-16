import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format date to 'DD MMM YYYY, hh:mm A'
 * @param {string|Date} date
 * @returns {string} Formatted date string
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(d.getTime())) return '-';
    return format(d, 'dd MMM yyyy, hh:mm a');
  } catch {
    return '-';
  }
};

/**
 * Format date to 'DD MMM YYYY'
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateOnly = (date) => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(d.getTime())) return '-';
    return format(d, 'dd MMM yyyy');
  } catch {
    return '-';
  }
};

/**
 * Relative time from now (e.g. '2 hours ago', 'yesterday')
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(d.getTime())) return '-';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '-';
  }
};
