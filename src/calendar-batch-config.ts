import { CalendarEvent, generateIcsForCalendarEvent } from "./calendar-event";

export interface CalendarBatchConfig {
  startDate: Date;
  batchName: string;
}

export function generateIcsFromConfig(
  calendarConfig: CalendarBatchConfig,
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
    lines.push(...generateIcsForCalendarEvent(event, calendarConfig));
  });

  lines.push("END:VCALENDAR");

  return lines.join("\n");
}
