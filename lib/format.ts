/**
 * Formats a number as currency (MMK)
 * @param amount - The amount to format
 * @param options - Additional formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  options?: {
    showSign?: boolean;
    minimumFractionDigits?: number;
  }
): string {
  const { showSign = false, minimumFractionDigits = 0 } = options || {};

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MMK",
    minimumFractionDigits,
  }).format(Math.abs(amount));

  if (showSign && amount !== 0) {
    return amount > 0 ? `+${formatted}` : `-${formatted}`;
  }

  return formatted;
}
