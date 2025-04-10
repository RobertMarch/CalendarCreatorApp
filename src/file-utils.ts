import { v4 as uuidv4 } from "uuid";
import {
  CalendarBatchConfig,
  generateIcsFromConfig,
} from "./calendar-batch-config";
import { CalendarEvent } from "./calendar-event";
import { formatDate } from "./date-utils";

export function readEventsFromJson(file: Blob): Promise<CalendarEvent[]> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target) {
        const results: any[] = JSON.parse(e.target.result as string);

        const events: CalendarEvent[] = results.map((json: any) => {
          return {
            eventId: json.eventId || uuidv4(),
            startOffset: json.startOffset,
            duration: json.duration,
            isWholeDayEvent: json.isWholeDayEvent,
            summary: json.summary,
            description: json.description,
          };
        });

        resolve(events);
      }
    };
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file, "UTF-8");
  });
}

export function downloadEventsAsJson(config: CalendarEvent[]): void {
  const blob = new Blob([JSON.stringify(config)], {
    type: "data:application/json;charset=utf-8,",
  });
  downloadFile(blob, "event-config.json");
}

export function downloadCalendarAsIcs(
  events: CalendarEvent[],
  calendarConfig: CalendarBatchConfig
): void {
  const blob = new Blob([generateIcsFromConfig(calendarConfig, events)], {
    type: "data:text/plain;charset=utf-8,",
  });
  const fileName = `calendar_${calendarConfig.batchName}_${formatDate(
    calendarConfig.startDate,
    true
  )}.ics`;
  downloadFile(blob, fileName);
}

function downloadFile(fileBlob: Blob, fileName: string): void {
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(fileBlob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 0);
}
