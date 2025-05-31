import { BatchConfig } from "../types/calendar-batch-config";
import { CalendarEvent } from "../types/calendar-event";
import { formatDateForIcs } from "./date-utils";

export function generateIcsFromConfig(
  calendarConfig: BatchConfig,
  events: CalendarEvent[]
): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "PRODID:a26ee00a-2410-4fa5-966f-df02886bd7e7/rmarch/calendar-creator",
    "VERSION:2.0",
    "METHOD:PUBLISH",
    "",
  ];

  events.forEach((event: CalendarEvent) => {
    lines.push(...generateIcsForCalendarEvent(calendarConfig, event));
  });

  lines.push("END:VCALENDAR");

  return lines.join("\n");
}

function generateIcsForCalendarEvent(
  calendarConfig: BatchConfig,
  event: CalendarEvent
): string[] {
  const startDateEpoch =
    calendarConfig.startDate!.getTime() + event.startOffset;
  const startDate: string = formatDateForIcs(
    new Date(startDateEpoch),
    event.isWholeDayEvent
  );
  const endDate: string = formatDateForIcs(
    new Date(startDateEpoch + event.duration),
    event.isWholeDayEvent
  );

  const eventId = `${calendarConfig.templateName}-${calendarConfig.batchName}-${event.summary}_${startDate}-${endDate}`;
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
