export function formatTo12Hour(isoString: string) {
  const date = new Date(isoString);

  // Check if the date is actually valid before processing
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Converts an ISO date string into a relative time string (e.g., "5 minutes ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Define intervals in seconds
  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  // Handle future dates or immediate actions
  if (seconds < 5) return 'just now';

  for (const [unit, value] of Object.entries(intervals)) {
    const counter = Math.floor(seconds / value);
    
    if (counter > 0) {
      // Logic for pluralization (e.g., "1 minute" vs "2 minutes")
      return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
    }
  }

  return dateString; // Fallback
};