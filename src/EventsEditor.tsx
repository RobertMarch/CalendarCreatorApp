import { CalendarEvent } from "./calendar-event";

type EventsEditorProps = {
  events: CalendarEvent[];
  setEvents: (newEvents: CalendarEvent[]) => void;
};

export function EventsEditor({ events, setEvents }: EventsEditorProps) {
  const eventInputs = events.map((event) => {
    return <EventInput calendarEvent={event} key={event.eventId}></EventInput>;
  });

  return eventInputs;
}

type EventInputProps = { calendarEvent: CalendarEvent };

function EventInput({ calendarEvent }: EventInputProps) {
  return (
    <div>
      <p>Event</p>
      <p>{calendarEvent.startOffset}</p>
      <p>{calendarEvent.duration}</p>
      <p>{calendarEvent.isWholeDayEvent}</p>
      <p>{calendarEvent.summary}</p>
      <p>{calendarEvent.description}</p>
    </div>
  );
}
