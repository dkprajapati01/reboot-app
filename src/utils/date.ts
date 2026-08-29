import { format, parseISO, differenceInCalendarDays, isValid } from "date-fns";

export function todayStr(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function toDateStr(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function safeParseISO(s: string): Date | null {
  try {
    const d = parseISO(s);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

export function daysBetween(a: string, b: string): number {
  const da = safeParseISO(a);
  const db = safeParseISO(b);
  if (!da || !db) return 0;
  return differenceInCalendarDays(db, da);
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
