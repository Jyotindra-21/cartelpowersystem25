export function formatIndianCurrency(number: number) {
  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0, // No paise if price is whole number
    maximumFractionDigits: 2, // Show up to 2 decimal places
  }).format(number);

  return currency;
}
