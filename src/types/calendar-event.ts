import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  MILLIS_IN_ONE_DAY,
  MILLIS_IN_ONE_HOUR,
  MILLIS_IN_ONE_MINUTE,
} from "../utils/date-utils";
import { BatchConfig } from "./calendar-batch-config";

export interface CalendarEvent {
  eventId: string;
  startOffset: number;
  duration: number;
  isWholeDayEvent: boolean;
  summary: string;
  description: string;
  included: boolean;
}

export function useEvents() {
  const cachedEvents: CalendarEvent[] = deserialiseEvents(
    localStorage.getItem("events")
  );

  const [events, setEvents] = useState<CalendarEvent[]>(cachedEvents);

  const saveEvents = (newEvents: CalendarEvent[]) => {
    localStorage.setItem("events", JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  return {
    events,
    setEvents: saveEvents,
  };
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

export function deserialiseEvent(json: any): CalendarEvent {
  return {
    eventId: json.eventId || uuidv4(),
    startOffset: json.startOffset || 0,
    duration: json.duration || MILLIS_IN_ONE_HOUR,
    isWholeDayEvent: json.isWholeDayEvent || false,
    summary: json.summary || "",
    description: json.description || "",
    included: json.included != false,
  };
}

export function parseEventFromFullCalendar(
  fullCalendarEvent: any,
  batchConfig: BatchConfig,
  defaultEventOptions?: CalendarEvent
): CalendarEvent {
  const startOffset =
    fullCalendarEvent.start.getTime() -
    fullCalendarEvent.start.getTimezoneOffset() * MILLIS_IN_ONE_MINUTE -
    batchConfig.startDate!.getTime();
  const duration: number = parseFullCalendarDuration(fullCalendarEvent);

  return {
    eventId: fullCalendarEvent.id || uuidv4(),
    startOffset: startOffset,
    duration: duration,
    isWholeDayEvent: fullCalendarEvent.allDay || false,
    summary: fullCalendarEvent.title || defaultEventOptions?.summary || "",
    description:
      fullCalendarEvent.description || defaultEventOptions?.description || "",
    included: true,
  };
}

function parseFullCalendarDuration(fullCalendarEvent: any): number {
  if (fullCalendarEvent.end != null) {
    return fullCalendarEvent.end?.getTime() - fullCalendarEvent.start.getTime();
  }
  return fullCalendarEvent.allDay ? MILLIS_IN_ONE_DAY : MILLIS_IN_ONE_HOUR;
}

export function newCalendarEvent(): CalendarEvent {
  return {
    eventId: uuidv4(),
    startOffset: 9 * MILLIS_IN_ONE_HOUR,
    duration: MILLIS_IN_ONE_HOUR,
    isWholeDayEvent: false,
    summary: "",
    description: "",
    included: true,
  };
}
