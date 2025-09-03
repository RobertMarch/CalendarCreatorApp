import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { BatchConfig } from "./types/calendar-batch-config";
import {
  CalendarEvent,
  parseEventFromFullCalendar,
} from "./types/calendar-event";
import { formatDateForCalendarView } from "./utils/date-utils";

type CalendarViewProps = {
  events: CalendarEvent[];
  setEvents: (newEvents: CalendarEvent[]) => void;
  batchConfig: BatchConfig;
};

export function CalendarView({
  events,
  setEvents,
  batchConfig,
}: CalendarViewProps) {
  if (!batchConfig.startDate || isNaN(batchConfig.startDate.getTime())) {
    return <div>Select a start date to view events as a calendar</div>;
  }

  const fullCalendarEvents = events
    .filter((e) => e.included)
    .map((e) => {
      return {
        id: e.eventId,
        title: e.summary,
        start: formatDateForCalendarView(
          new Date(e.startOffset + batchConfig.startDate!.getTime()),
          e.isWholeDayEvent
        ),
        end: formatDateForCalendarView(
          new Date(
            e.startOffset + (e.duration || 0) + batchConfig.startDate!.getTime()
          ),
          e.isWholeDayEvent
        ),
        allDay: e.isWholeDayEvent,
      };
    });

  /**
   * Handles a new event creation by opening a modal to prompt confirmation of the new event title.
   */
  function handleEventCreate(selectInfo: any) {
    let calendarApi = selectInfo.view.calendar;
    let title = prompt("Please enter a new title for your event");

    // Clear date selection
    calendarApi.unselect();

    if (title) {
      const calendarEvent: CalendarEvent = parseEventFromFullCalendar(
        selectInfo,
        batchConfig
      );
      calendarEvent.summary = title;

      const nextEvents: CalendarEvent[] = events.slice();
      nextEvents.push(calendarEvent);
      setEvents(nextEvents);
    }
  }

  /**
   * Handles a click on an event to scroll it into view and add a temporary blue background.
   */
  function handleEventClick(clickInfo: any) {
    const element = document.getElementById(clickInfo.event.id);
    element?.scrollIntoView({ behavior: "smooth", block: "nearest" });

    element?.classList.add("bg-blue-50");
    setTimeout(() => {
      element?.classList.remove("bg-blue-50");
    }, 750);
  }

  /**
   * Handles a drag and drop, or resize of an existing event by updating the event and emitting the new list.
   */
  function handleEventChange(changeInfo: any) {
    const nextEvents: CalendarEvent[] = events.slice();
    const oldEventIndex: number = nextEvents.findIndex(
      (e) => e.eventId === changeInfo.event.id
    );
    const oldEvent: CalendarEvent = events[oldEventIndex];

    const updatedCalendarEvent: CalendarEvent = parseEventFromFullCalendar(
      changeInfo.event,
      batchConfig,
      oldEvent
    );

    nextEvents.splice(oldEventIndex, 1, updatedCalendarEvent || oldEvent);
    setEvents(nextEvents);
  }

  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      initialView="timeGridWeek"
      businessHours={{
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: "09:00:00",
        endTime: "17:00:00",
      }}
      scrollTime="08:00:00"
      height="100%"
      events={fullCalendarEvents}
      nowIndicator={true}
      dayMaxEvents={true}
      editable={true}
      selectable={true}
      selectMirror={true}
      firstDay={1}
      select={handleEventCreate}
      eventClick={handleEventClick}
      eventChange={handleEventChange} // Called for drag-n-drop/resize
    ></FullCalendar>
  );
}
