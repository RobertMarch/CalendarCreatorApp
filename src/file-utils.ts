import { BatchConfig, generateIcsFromConfig } from "./calendar-batch-config";
import { CalendarEvent, deserialiseEvents } from "./calendar-event";
import { formatDateForIcs } from "./date-utils";

export function readEventsFromJson(file: Blob): Promise<CalendarEvent[]> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target) {
        resolve(deserialiseEvents(e.target.result as string));
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
  calendarConfig: BatchConfig,
  events: CalendarEvent[]
): void {
  const blob = new Blob([generateIcsFromConfig(calendarConfig, events)], {
    type: "data:text/plain;charset=utf-8,",
  });
  const fileName = `calendar_${calendarConfig.batchName}_${formatDateForIcs(
    calendarConfig.startDate!,
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
