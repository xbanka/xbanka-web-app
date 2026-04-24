/**
 * Simple formatter to round to exactly 2 decimal places.
 * Example: -1.3837559386 -> -1.38
 */
export const formatToTwoDecimals = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formats large numbers to whole numbers, 
 * but keeps 2 decimal places for values below 1.
 * Example: 75152.0274771 -> 75,152
 * Example: 0.99958 -> 1.00 (or 0.99 depending on rounding)
 */
export const formatPrice = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";

  if (Math.abs(num) >= 1) {
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};