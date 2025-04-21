import { format } from "date-fns";

export function formatDate(date: Date, isDateOnly: boolean): string {
  return isDateOnly
    ? format(date, "yyyyMMdd")
    : format(date, "yyyyMMdd'T'HHmmss");
}

export function formatDateForInput(date?: Date): string | null {
  return !!date ? date.toISOString().split("T")[0] : "";
}

export const MILLIS_IN_ONE_MINUTE = 60 * 1000;
export const MILLIS_IN_ONE_HOUR = 60 * MILLIS_IN_ONE_MINUTE;
export const MILLIS_IN_ONE_DAY = 24 * MILLIS_IN_ONE_HOUR;
export const MILLIS_IN_ONE_WEEK = 7 * MILLIS_IN_ONE_DAY;

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
