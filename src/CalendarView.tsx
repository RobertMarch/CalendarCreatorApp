import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { BatchConfig } from "./types/calendar-batch-config";
import { CalendarEvent } from "./types/calendar-event";
import { formatDateForCalendarView } from "./utils/date-utils";

type CalendarViewProps = {
  events: CalendarEvent[];
  batchConfig: BatchConfig;
};

export function CalendarView({
  events,
  batchConfig,
}: CalendarViewProps) {
  if (!batchConfig.startDate) {
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
            e.startOffset + e.duration + batchConfig.startDate!.getTime()
          ),
          e.isWholeDayEvent
        ),
        allDay: e.isWholeDayEvent,
      };
    });

  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin]}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      initialView="timeGridWeek"
      height="100%"
      events={fullCalendarEvents}
      nowIndicator={true}
      dayMaxEvents={true}
      firstDay={1}
    ></FullCalendar>
  );
}
