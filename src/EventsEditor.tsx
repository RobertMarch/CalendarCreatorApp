import { useState } from "react";
import { StyledButton, StyledInput } from "./StyledComponents";
import { BatchConfig } from "./types/calendar-batch-config";
import { CalendarEvent, newCalendarEvent } from "./types/calendar-event";
import {
  formatDateForDisplay,
  formatTimeAsDuration,
  formatTimestampAsDays,
  formatTimestampAsTime,
  MILLIS_IN_ONE_DAY,
} from "./utils/date-utils";

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
  const [confirmDeleteAll, setConfirmDeleteAll] = useState<boolean>(false);
  const [showDescriptions, setShowDescriptions] = useState<boolean>(false);

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

  function deleteAllEvents(): void {
    if (confirmDeleteAll) {
      setEvents([]);
    } else {
      setTimeout(() => setConfirmDeleteAll(false), 4000);
    }
    setConfirmDeleteAll(!confirmDeleteAll);
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
        showDescription={showDescriptions}
      ></EventInput>
    );
  });

  return (
    <>
      <div className="flex flex-row">
        <StyledButton
          displayText="Add event"
          onClick={handleAddEvent}
        ></StyledButton>
        <StyledButton
          displayText="Sort events"
          onClick={sortEvents}
          disabled={!events.length}
        ></StyledButton>
        <StyledButton
          displayText={
            confirmDeleteAll ? "Confirm delete all events" : "Delete all events"
          }
          onClick={deleteAllEvents}
          disabled={!events.length}
          colour="red"
        ></StyledButton>

        <div className="content-center">
          <label className="w-max flex flex-row justify-between">
            <input
              type="checkbox"
              checked={showDescriptions}
              onChange={(e) => setShowDescriptions(e.target.checked)}
            ></input>
            <div className="pl-2">Show event descriptions</div>
          </label>
        </div>
      </div>

      {eventInputs}
    </>
  );
}

type EventInputProps = {
  calendarEvent: CalendarEvent;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (event: CalendarEvent) => void;
  batchConfig: BatchConfig;
  showDescription: boolean;
};

function EventInput({
  calendarEvent,
  updateEvent,
  deleteEvent,
  batchConfig,
  showDescription,
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

  return (
    <div className="flex flex-row border-b border-gray-400 py-4">
      <div className="border-r border-gray-400 pr-2 mr-2">
        <label className="w-max flex flex-row justify-between pb-4">
          <input
            type="checkbox"
            checked={calendarEvent.included}
            onChange={(e) => setValue(e.target.checked, "included")}
          ></input>
          <div className="pl-2 w-20">Include in ics export</div>
        </label>
        <StyledButton
          displayText="Delete"
          onClick={() => deleteEvent(calendarEvent)}
          colour="red"
        ></StyledButton>
      </div>
      <div className="flex flex-col space-between space-y-1">
        <StyledInput
          label="Event title"
          value={calendarEvent.summary}
          setValue={(val) => setValue(val, "summary")}
        ></StyledInput>
        {showDescription ? (
          <StyledInput
            label="Description"
            value={calendarEvent.description}
            setValue={(val) => setValue(val, "description")}
          ></StyledInput>
        ) : (
          <></>
        )}
        <label className="w-min flex flex-row justify-between">
          <div className="w-36 text-right pr-2">Whole day:</div>
          <input
            type="checkbox"
            checked={calendarEvent.isWholeDayEvent}
            onChange={(e) => setWholeDayEvent(e.target.checked)}
          ></input>
        </label>
        <StartTimeInput
          calendarEvent={calendarEvent}
          batchStartDate={batchConfig.startDate}
          setStartOffset={(startOffset) => setValue(startOffset, "startOffset")}
          setDuration={(duration) => setValue(duration, "duration")}
        ></StartTimeInput>
      </div>
    </div>
  );
}

type StartTimeInputProps = {
  calendarEvent: CalendarEvent;
  batchStartDate: Date | undefined;
  setStartOffset: (nextStartOffset: number) => void;
  setDuration: (nextDuration: number) => void;
};

function StartTimeInput({
  calendarEvent,
  batchStartDate,
  setStartOffset,
  setDuration,
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

  let startDateDisplayString;
  if (batchStartDate) {
    const startDateInBatch = new Date(
      batchStartDate!.getTime() + calendarEvent.startOffset
    );

    startDateDisplayString = formatDateForDisplay(
      startDateInBatch,
      calendarEvent.isWholeDayEvent
    );
  } else {
    startDateDisplayString = "Set a batch start date to see event start time.";
  }

  return (
    <div className="flex flex-row">
      <div className="w-36 text-right pr-2">Start offset:</div>
      <div className="flex flex-col">
        <div className="flex flex-row space-between space-x-4">
          <StyledInput
            label="Weeks"
            value={startOffsetParts.weeks}
            setValue={(val) => setStartOffsetPart(val, "weeks")}
            type="number"
            flexDirection="col"
          ></StyledInput>
          <StyledInput
            label="Days"
            value={startOffsetParts.days}
            setValue={(val) => setStartOffsetPart(val, "days")}
            type="number"
            flexDirection="col"
          ></StyledInput>
          {calendarEvent.isWholeDayEvent ? (
            <></>
          ) : (
            <StyledInput
              label="Time"
              value={startOffsetParts.time}
              setValue={(val) => setStartOffsetPart(val, "time")}
              type="time"
              flexDirection="col"
            ></StyledInput>
          )}
          <DurationInput
            calendarEvent={calendarEvent}
            setDuration={(duration) => setDuration(duration)}
          ></DurationInput>
        </div>
        <p>{startDateDisplayString}</p>
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
      flexDirection="col"
    ></StyledInput>
  ) : (
    <StyledInput
      label="Duration"
      value={formatTimestampAsTime(calendarEvent.duration, false)}
      setValue={(val) => setDuration(Math.max(formatTimeAsDuration(val), 0))}
      type="time"
      flexDirection="col"
    ></StyledInput>
  );
}
