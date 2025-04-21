import { v4 as uuidv4 } from "uuid";

export interface CalendarEvent {
  eventId: string;
  startOffset: number;
  duration: number;
  isWholeDayEvent: boolean;
  summary: string;
  description: string;
}

export function deserialiseEvents(jsonString: string | null): CalendarEvent[] {
  if (!jsonString) {
    return [];
  }

  const events: CalendarEvent[] = JSON.parse(jsonString).map((json: any) =>
    deserialiseEvent(json)
  );

  return events;
}

function deserialiseEvent(json: any): CalendarEvent {
  return {
    eventId: json.eventId || uuidv4(),
    startOffset: json.startOffset || 0,
    duration: json.duration || 60 * 60 * 1000,
    isWholeDayEvent: json.isWholeDayEvent || false,
    summary: json.summary || "",
    description: json.description || "",
  };
}
