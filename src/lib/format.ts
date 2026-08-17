const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return toPersianDigits(String(value));
  return toPersianDigits(num.toLocaleString("en-US"));
}

export function formatToman(value: number | string): string {
  return `${formatNumber(value)} تومان`;
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${toPersianDigits((value / 1_000_000).toFixed(1).replace(/\.0$/, ""))} میلیون`;
  }
  if (value >= 1_000) {
    return `${toPersianDigits((value / 1_000).toFixed(1).replace(/\.0$/, ""))} هزار`;
  }
  return formatNumber(value);
}

export function formatDate(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
  return formatted;
}

export function formatDateTime(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return formatted;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
