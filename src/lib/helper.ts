export function formatIndianCurrency(number: number) {
  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0, // No paise if price is whole number
    maximumFractionDigits: 2, // Show up to 2 decimal places
  }).format(number);

  return currency;
}

export function formatDuration(seconds: number) {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

export function formatPageName(url: string) {
  if (url === "/") return "Home";
  const parts = url
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  return parts.join(" → ");
}
