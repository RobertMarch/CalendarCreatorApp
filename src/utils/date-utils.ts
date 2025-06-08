import { utc } from "@date-fns/utc";
import { format } from "date-fns";

export const MILLIS_IN_ONE_MINUTE = 60 * 1000;
export const MILLIS_IN_ONE_HOUR = 60 * MILLIS_IN_ONE_MINUTE;
export const MILLIS_IN_ONE_DAY = 24 * MILLIS_IN_ONE_HOUR;
export const MILLIS_IN_ONE_WEEK = 7 * MILLIS_IN_ONE_DAY;

export function formatDateForIcs(date: Date, isDateOnly: boolean): string {
  return isDateOnly
    ? format(date, "yyyyMMdd", { in: utc })
    : format(date, "yyyyMMdd'T'HHmmss", { in: utc });
}

export function formatDateForCalendarView(
  date: Date,
  isDateOnly: boolean
): string {
  if (!isValidDate(date)) {
    return "";
  }
  return isDateOnly
    ? format(date, "yyyy-MM-dd", { in: utc })
    : format(date, "yyyy-MM-dd'T'HH:mm:ss", { in: utc });
}

export function formatDateForInput(date?: Date): string | null {
  return !!date && isValidDate(date)
    ? format(date, "yyyy-MM-dd", { in: utc })
    : "";
}

export function formatDateForDisplay(date: Date, isDateOnly: boolean): string {
  if (!isValidDate(date)) {
    return "";
  }
  return isDateOnly
    ? format(date, "EEE dd MMM yyyy", { in: utc })
    : format(date, "EEE dd MMM yyyy HH:mm", { in: utc });
}

function isValidDate(date?: Date): boolean {
  return !!date && !isNaN(date.getTime());
}

export function formatTimestampAsDays(timestamp: number): number {
  return Math.floor(timestamp / MILLIS_IN_ONE_DAY);
}

export function formatTimestampAsTime(
  timestamp: number,
  limitToOneDay: boolean
): string {
  const hoursNumber: number = Math.floor(timestamp / MILLIS_IN_ONE_HOUR);
  const hours: string = (
    limitToOneDay ? hoursNumber % 24 : hoursNumber
  ).toFixed(0);
  const minutes: string = Math.floor(
    (timestamp / MILLIS_IN_ONE_MINUTE) % 60
  ).toFixed(0);
  if (!hours || !minutes) {
    return "00:00";
  }
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

export function formatTimeAsDuration(time: string): number {
  const numberParts: number[] = time.split(":").map((v) => Number.parseInt(v));
  return (numberParts[0] * 60 + numberParts[1]) * MILLIS_IN_ONE_MINUTE;
}
