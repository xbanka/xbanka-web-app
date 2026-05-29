export const formatCurrencyAmount = (
  amount: number | string,
  currency: string,
) => {
  if (currency === "NGN") {
    return `₦${Number(amount).toLocaleString()}`;
  }

  return `${amount} ${currency}`;
};