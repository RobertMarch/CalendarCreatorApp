import { BatchConfig } from "../types/calendar-batch-config";
import { CalendarEvent } from "../types/calendar-event";
import {
  CalendarTemplate,
  deserialiseTempate,
} from "../types/calendar-template";
import { formatDateForIcs } from "./date-utils";
import { generateIcsFromConfig } from "./ics-file-utils";

export function readTemplateFromJson(file: Blob): Promise<CalendarTemplate> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target) {
        resolve(deserialiseTempate(e.target.result as string));
      }
    };
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file, "UTF-8");
  });
}

export function downloadEventsAsJson(
  calendarConfig: BatchConfig,
  events: CalendarEvent[]
): void {
  const template: CalendarTemplate = {
    templateName: calendarConfig.templateName,
    events,
  };
  const blob = new Blob([JSON.stringify(template)], {
    type: "data:application/json;charset=utf-8,",
  });
  downloadFile(blob, `${calendarConfig.templateName} - template.json`);
}

export function downloadCalendarAsIcs(
  calendarConfig: BatchConfig,
  events: CalendarEvent[]
): void {
  const blob = new Blob([generateIcsFromConfig(calendarConfig, events)], {
    type: "data:text/plain;charset=utf-8,",
  });
  const fileName = `calendar_${calendarConfig.templateName}_${calendarConfig.batchName}_${formatDateForIcs(
    calendarConfig.startDate!,
    true
  )}.ics`;
  downloadFile(blob, fileName);
}

function downloadFile(fileBlob: Blob, fileName: string): void {
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(fileBlob);
  link.download = escapeFileName(fileName);

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 0);
}

function escapeFileName(stringToEscape: string): string {
  return stringToEscape.replace(/([^a-z0-9 .-_()]+)/gi, "_");
}
