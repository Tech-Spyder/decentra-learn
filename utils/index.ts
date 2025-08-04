import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getFormatAddress(address: string, width?: number): string {
  const xxl = 1800
  if (address && address.length !== 42) {
    return 'Invalid Ethereum Address'
  }
  if (width && width >= xxl) {
    return address
  }
  const start = address?.slice(0, 4)
  const end = address?.slice(-4)
  return `${start}...${end}`
}

export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k";
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "M";
  if (num < 1_000_000_000_000) return (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + "B";
  return (num / 1_000_000_000_000).toFixed(num % 1_000_000_000_000 === 0 ? 0 : 1) + "T";
}


export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
export function unslugify(slug: string): string {
  return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}