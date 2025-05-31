import { CalendarEvent, deserialiseEvent } from "./calendar-event";

export interface CalendarTemplate {
  templateName: string;
  events: CalendarEvent[];
}

export function deserialiseTempate(
  jsonString: string | null
): CalendarTemplate {
  if (!jsonString) {
    return {
      templateName: "",
      events: [],
    };
  }

  const parsedJson: any = JSON.parse(jsonString);
  let templateName: string = "";
  let eventsJson: any[];

  if (parsedJson instanceof Array) {
    eventsJson = parsedJson;
  } else {
    templateName = parsedJson.templateName;
    eventsJson = parsedJson.events;
  }

  const events: CalendarEvent[] = eventsJson.map((json: any) =>
    deserialiseEvent(json)
  );

  return {
    templateName,
    events,
  };
}
