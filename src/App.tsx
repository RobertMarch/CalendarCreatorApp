import { useRef, useState } from "react";
import { CalendarBatchConfig } from "./calendar-batch-config";
import { CalendarEvent } from "./calendar-event";
import {
  downloadCalendarAsIcs,
  downloadEventsAsJson,
  readEventsFromJson,
} from "./file-utils";

function App() {
  const [eventConfig, setEventConfig] = useState<CalendarEvent[]>([]);
  const [calendarConfig, setCalendarConfig] = useState<CalendarBatchConfig>({
    batchName: "Test batch",
    startDate: new Date("2025 04 14"),
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const parsedData: CalendarEvent[] = await readEventsFromJson(
      event.target.files[0]
    );
    setEventConfig(parsedData);
  };

  const events = eventConfig.map((event) => {
    return <CalEvent calendarEvent={event} key={event.eventId}></CalEvent>;
  });

  return (
    <>
      <h1 className="text-3xl font-bold underline">Calendar creator</h1>
      <input
        hidden
        type="file"
        accept=".json,application/json"
        onChange={onFileUpload}
        ref={fileInputRef}
      ></input>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => fileInputRef.current!.click()}
      >
        Import from json
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!calendarConfig}
        onClick={() => downloadCalendarAsIcs(eventConfig, calendarConfig!)}
      >
        Export to ics file
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!calendarConfig || eventConfig.length == 0}
        onClick={() => downloadEventsAsJson(eventConfig)}
      >
        Export config to json
      </button>
      <CalBatchConfig calendarBatchConfig={calendarConfig}></CalBatchConfig>
      {events}
    </>
  );
}

type CalendarBatchConfigProps = {
  calendarBatchConfig: CalendarBatchConfig;
};

function CalBatchConfig({ calendarBatchConfig }: CalendarBatchConfigProps) {
  return (
    <div>
      <p>
        Batch name:
        {calendarBatchConfig.batchName}
      </p>
      <p>
        Start date:
        {calendarBatchConfig.startDate.toDateString()}
      </p>
    </div>
  );
}

type CalendarEventProps = { calendarEvent: CalendarEvent };

function CalEvent({ calendarEvent }: CalendarEventProps) {
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

export default App;
