import { CalendarBatchConfig } from "./calendar-batch-config";
import { formatDate } from "./date-utils";

export interface CalendarEvent {
  eventId: string;
  startOffset: number;
  duration: number;
  isWholeDayEvent: boolean;
  summary: string;
  description?: string;
}

export function generateIcsForCalendarEvent(
  event: CalendarEvent,
  calendarConfig: CalendarBatchConfig
): string[] {
  const startDateEpoch = calendarConfig.startDate.getTime() + event.startOffset;
  const startDate: string = formatDate(
    new Date(startDateEpoch),
    event.isWholeDayEvent
  );
  const endDate: string = formatDate(
    new Date(startDateEpoch + event.duration),
    event.isWholeDayEvent
  );

  const eventId = `${calendarConfig.batchName}-${event.summary}_${startDate}-${endDate}`;
  const lines = [
    "BEGIN:VEVENT",
    `DTSTART${event.isWholeDayEvent ? ";VALUE=DATE" : ""}:${startDate}`,
    `DTEND${event.isWholeDayEvent ? ";VALUE=DATE" : ""}:${endDate}`,
    "STATUS:CONFIRMED",
    `TRANSP:${event.isWholeDayEvent ? "TRANSPARENT" : "OPAQUE"}`,
    `SUMMARY:${calendarConfig.batchName} ${event.summary}`,
    `UID:${eventId}`,
  ];

  if (!!event.description) {
    lines.push(`DESCRIPTION:${event.description}`);
  }

  lines.push("END:VEVENT");

  return lines;
}
