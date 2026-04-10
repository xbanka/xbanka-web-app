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