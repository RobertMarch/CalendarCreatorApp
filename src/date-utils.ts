import { format } from "date-fns";

export function formatDate(date: Date, isDateOnly: boolean): string {
  return isDateOnly
    ? format(date, "yyyyMMdd")
    : format(date, "yyyyMMdd'T'HHmmss");
}

export function formatDateForInput(date?: Date): string | null {
  return !!date ? date.toISOString().split("T")[0] : null;
}
