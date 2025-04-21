import { BatchConfig } from "./calendar-batch-config";
import { CalendarEvent, newCalendarEvent } from "./calendar-event";
import {
  formatTimeAsDuration,
  formatTimestampAsDays,
  formatTimestampAsTime,
  MILLIS_IN_ONE_DAY,
} from "./date-utils";
import { StyledButton, StyledInput } from "./StyledComponents";

type EventsEditorProps = {
  events: CalendarEvent[];
  setEvents: (newEvents: CalendarEvent[]) => void;
  batchConfig: BatchConfig;
};

export function EventsEditor({
  events,
  setEvents,
  batchConfig,
}: EventsEditorProps) {
  function handleAddEvent(): void {
    const nextEvents: CalendarEvent[] = events.slice();
    nextEvents.push(newCalendarEvent());
    setEvents(nextEvents);
  }

  function sortEvents(): void {
    const nextEvents: CalendarEvent[] = events
      .slice()
      .sort((a, b) => a.startOffset - b.startOffset);
    setEvents(nextEvents);
  }

  function updateEvent(nextEvent: CalendarEvent): void {
    const nextEvents: CalendarEvent[] = events.slice();
    const oldEventIndex: number = nextEvents.findIndex(
      (e) => e.eventId === nextEvent.eventId
    );
    nextEvents.splice(oldEventIndex, 1, nextEvent);
    setEvents(nextEvents);
  }

  function deleteEvent(eventToDelete: CalendarEvent): void {
    const nextEvents: CalendarEvent[] = events.slice();
    const oldEventIndex: number = nextEvents.findIndex(
      (e) => e.eventId === eventToDelete.eventId
    );
    nextEvents.splice(oldEventIndex, 1);
    setEvents(nextEvents);
  }

  const eventInputs = events.map((event) => {
    return (
      <EventInput
        key={event.eventId}
        calendarEvent={event}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
        batchConfig={batchConfig}
      ></EventInput>
    );
  });

  return (
    <>
      <StyledButton
        displayText="Add event"
        onClick={handleAddEvent}
      ></StyledButton>
      <StyledButton
        displayText="Sort events"
        onClick={sortEvents}
        disabled={!events.length}
      ></StyledButton>

      {eventInputs}
    </>
  );
}

type EventInputProps = {
  calendarEvent: CalendarEvent;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (event: CalendarEvent) => void;
  batchConfig: BatchConfig;
};

function EventInput({
  calendarEvent,
  updateEvent,
  deleteEvent,
  batchConfig,
}: EventInputProps) {
  function setValue(newValue: any, propertyName: keyof CalendarEvent): void {
    const updatedEvent: CalendarEvent = {
      ...calendarEvent,
      [propertyName]: newValue,
    };
    updateEvent(updatedEvent);
  }

  function setWholeDayEvent(isWholeDayEvent: boolean): void {
    const updatedEvent: CalendarEvent = {
      ...calendarEvent,
      isWholeDayEvent,
    };

    if (isWholeDayEvent) {
      updatedEvent.duration = MILLIS_IN_ONE_DAY;
      updatedEvent.startOffset =
        updatedEvent.startOffset -
        (updatedEvent.startOffset % MILLIS_IN_ONE_DAY);
    }

    updateEvent(updatedEvent);
  }

  let startDateDisplayString;
  if (batchConfig?.startDate) {
    const startDateInBatch = new Date(
      batchConfig.startDate!.getTime() + calendarEvent.startOffset
    );
    startDateDisplayString = calendarEvent.isWholeDayEvent
      ? startDateInBatch.toDateString()
      : startDateInBatch.toUTCString();
  } else {
    startDateDisplayString = "Please set a batch start date to see start time";
  }

  return (
    <div className="border-b border-gray-400 py-4 flex flex-col space-between space-y-1">
      <StyledInput
        label="Event title"
        value={calendarEvent.summary}
        setValue={(val) => setValue(val, "summary")}
      ></StyledInput>
      <StyledInput
        label="Description"
        value={calendarEvent.description}
        setValue={(val) => setValue(val, "description")}
      ></StyledInput>
      <label>
        Whole day event:
        <input
          type="checkbox"
          checked={calendarEvent.isWholeDayEvent}
          onChange={(e) => setWholeDayEvent(e.target.checked)}
          className="ml-2"
        ></input>
      </label>
      <StartTimeInput
        calendarEvent={calendarEvent}
        setStartOffset={(startOffset) => setValue(startOffset, "startOffset")}
      ></StartTimeInput>
      <DurationInput
        calendarEvent={calendarEvent}
        setDuration={(duration) => setValue(duration, "duration")}
      ></DurationInput>

      <p>
        Based on the batch start date, this event will start at:{" "}
        {startDateDisplayString}
      </p>
      <div>
        <StyledButton
          displayText="Delete event"
          onClick={() => deleteEvent(calendarEvent)}
        ></StyledButton>
      </div>
    </div>
  );
}

type StartTimeInputProps = {
  calendarEvent: CalendarEvent;
  setStartOffset: (nextStartOffset: number) => void;
};

function StartTimeInput({
  calendarEvent,
  setStartOffset,
}: StartTimeInputProps) {
  const startOffsetParts = {
    weeks:
      Math.floor(formatTimestampAsDays(calendarEvent.startOffset) / 7) || 0,
    days: Math.floor(formatTimestampAsDays(calendarEvent.startOffset) % 7) || 0,
    time: formatTimestampAsTime(calendarEvent.startOffset, true),
  };

  function processUpdatedValue(
    nextValue: string,
    partName: "weeks" | "days" | "time"
  ): string | number {
    switch (partName) {
      case "weeks":
        return nextValue ? Math.max(Number.parseInt(nextValue), 0) : 0;
      case "days":
        const minValue: number = calendarEvent.isWholeDayEvent ? 1 : 0;
        return nextValue
          ? Math.max(Number.parseInt(nextValue), minValue)
          : minValue;
      case "time":
        return nextValue ? nextValue : "00:00";
    }
  }

  function setStartOffsetPart(
    nextValue: string,
    partName: "weeks" | "days" | "time"
  ) {
    const processedNextValue: string | number = processUpdatedValue(
      nextValue,
      partName
    );
    const newStartOffsetSplit = {
      ...startOffsetParts,
      [partName]: processedNextValue,
    };

    const startOffsetAsEpochTimestamp: number =
      (newStartOffsetSplit.weeks * 7 + newStartOffsetSplit.days) *
        MILLIS_IN_ONE_DAY +
      formatTimeAsDuration(newStartOffsetSplit.time);

    setStartOffset(startOffsetAsEpochTimestamp);
  }

  return (
    <div className="flex flex-col">
      Start offset:
      <div className="flex flex-col pl-4">
        <StyledInput
          label="Weeks"
          value={startOffsetParts.weeks}
          setValue={(val) => setStartOffsetPart(val, "weeks")}
          type="number"
        ></StyledInput>
        <StyledInput
          label="Days"
          value={startOffsetParts.days}
          setValue={(val) => setStartOffsetPart(val, "days")}
          type="number"
        ></StyledInput>
        {calendarEvent.isWholeDayEvent ? (
          <></>
        ) : (
          <StyledInput
            label="Time (hh:mm)"
            value={startOffsetParts.time}
            setValue={(val) => setStartOffsetPart(val, "time")}
            type="time"
          ></StyledInput>
        )}
      </div>
    </div>
  );
}

type DurationInputProps = {
  calendarEvent: CalendarEvent;
  setDuration: (nextDuration: number) => void;
};

function DurationInput({ calendarEvent, setDuration }: DurationInputProps) {
  return calendarEvent.isWholeDayEvent ? (
    <StyledInput
      label="Duration (days)"
      value={formatTimestampAsDays(calendarEvent.duration)}
      setValue={(val) =>
        setDuration(
          val ? Math.max(Number.parseInt(val), 1) * MILLIS_IN_ONE_DAY : 1
        )
      }
      type="number"
    ></StyledInput>
  ) : (
    <StyledInput
      label="Duration (hh:mm)"
      value={formatTimestampAsTime(calendarEvent.duration, false)}
      setValue={(val) => setDuration(Math.max(formatTimeAsDuration(val), 0))}
      type="time"
    ></StyledInput>
  );
}
