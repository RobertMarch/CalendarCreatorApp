import { PropsWithChildren, useState } from "react";
import { BatchConfigInput } from "./BatchConfigInput";
import { BatchConfig } from "./calendar-batch-config";
import { CalendarEvent } from "./calendar-event";
import { EventsEditor } from "./EventsEditor";
import { FileButtons } from "./FileButtons";

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [batchConfig, setBatchConfig] = useState<BatchConfig>({
    batchName: "",
    startDate: undefined,
  });

  return (
    <>
      <div className="flex flex-col justify-around h-full space-y-4 p-8 bg-linear-to-r from-sky-200 to-teal-100">
        <h1 className="text-3xl font-bold">Calendar creator</h1>
        <p>
          Create a ics calendar file to import into a calendar based on provided
          config, useful for when you have batches of events that are repeated
          on an irregular basis.
        </p>
        <Card>
          <FileButtons
            batchConfig={batchConfig}
            events={events}
            setEvents={setEvents}
          ></FileButtons>
        </Card>
        <Card>
          <BatchConfigInput
            batchConfig={batchConfig}
            setBatchConfig={setBatchConfig}
          ></BatchConfigInput>
        </Card>
        <Card>
          <EventsEditor events={events} setEvents={setEvents}></EventsEditor>
        </Card>
      </div>
    </>
  );
}

function Card({ children }: PropsWithChildren) {
  return <div className="p-4 bg-white rounded-lg space-y-2">{children}</div>;
}

export default App;
